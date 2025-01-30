import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import {
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
  uploadMedia,
} from "../utils/cloudinary.js";

export const createCourse = async (req, res) => {
  console.log("Create Course");
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({
        success: false,
        message: "Course title and Category is required.",
      });
    }
    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });
    return res.status(201).json({ success: true, message: "Course created." });
  } catch (error) {
    console.error("Error in Create Course:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: Create Course",
    });
  }
};
export const getPublishedCourse = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl",
    });
    if (!courses) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    return res.status(200).json({
      courses,
      success: true,
      message: "Course Found",
    });
  } catch (error) {
    console.error("Error in Get Published Course:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: Get Published Course",
    });
  }
};
export const getCreatorCourse = async (req, res) => {
  console.log("get create course");
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId });
    if (!courses) {
      return res
        .status(404)
        .json({ success: false, message: "Course Not Found", courses: [] });
    }
    return res
      .status(200)
      .json({ success: true, message: "Course Found", courses });
  } catch (error) {
    console.error("Error in Get Course:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error: Get Course" });
  }
};
export const editCourse = async (req, res) => {
  console.log("edit course");
  try {
    const courseId = req.params.courseId;
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;
    if (
      !courseTitle ||
      !subTitle ||
      !description ||
      !category ||
      !courseLevel ||
      isNaN(Number(coursePrice))
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required and must be valid. Course price must be a number.",
      });
    }
    let course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course Not Found" });
    }
    let courseThumbnail;
    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }
      courseThumbnail = await uploadMedia(thumbnail.path);
    }
    const updatedData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url,
    };
    course = await Course.findByIdAndUpdate(courseId, updatedData, {
      new: true,
    });
    return res
      .status(200)
      .json({ success: true, message: "Course updated successfully.", course });
  } catch (error) {
    console.error("Error in Edit Course:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error: Edit Course" });
  }
};
export const getCourseById = async (req, res) => {
  console.log("get course by id");
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    }
    return res
      .status(200)
      .json({ success: true, message: "Course found", course });
  } catch (error) {
    console.error("Error in Get Course By ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: Get Course By ID",
    });
  }
};
export const createLecture = async (req, res) => {
  console.log("Create Lecture");
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;
    if (!courseId || !lectureTitle) {
      return res.status(400).json({
        success: false,
        message: "Lecture title is required",
      });
    }
    const lecture = await Lecture.create({ lectureTitle });
    const course = await Course.findById(courseId);
    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(201).json({
      success: true,
      message: "Lecture created successfully",
      lecture,
    });
  } catch (error) {
    console.error("Error in Create Lecture:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: Create Lecture",
    });
  }
};
export const getCourseLecture = async (req, res) => {
  console.log("get course lecture");
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    return res.status(200).json({
      lectures: course.lectures,
      success: true,
      message: "Course found",
    });
  } catch (error) {
    console.error("Error in Get Lecture:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: Get Lecture",
    });
  }
};
export const editLecture = async (req, res) => {
  console.log("edit lec");
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
        success: false,
      });
    }
    // update lecture
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    //
    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(200).json({
      lecture,
      success: true,
      message: "Lecture updated successfully",
    });
  } catch (error) {
    console.error("Error in Edit Lecture:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: Edit Lecture",
    });
  }
};

export const removeLecture = async (req, res) => {
  console.log("remove lec");
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(400).json({
        message: "Lecture not found",
        success: false,
      });
    }
    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }

    await Course.updateOne(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } }
    );

    return res.status(200).json({
      message: "Lecture removed successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error in Remove Lecture:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: Remove Lecture",
    });
  }
};

export const getLectureById = async (req, res) => {
  console.log("lec by id");
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(400).json({
        message: "Lecture not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Lecture found",
      success: true,
      lecture,
    });
  } catch (error) {
    console.error("Error in Get Lecture By ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: Get Lecture By ID",
    });
  }
};

export const togglePublishCourse = async (req, res) => {
  try {
    console.log("togglePublishCourse", req.query.publish);
    const { courseId } = req.params;
    const { publish } = req.query; // true or false
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({
        message: "Course not found",
        success: false,
      });
    }
    course.isPublished = publish === "true";
    await course.save();
    const statusMessage = course.isPublished ? "publish" : "un publish";
    return res.status(200).json({
      success: true,
      message: `Course is ${statusMessage}`,
    });
  } catch (error) {
    console.error("Error in Publish/UnPublish:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: Publish/UnPublish",
    });
  }
};

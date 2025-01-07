import { Course } from "../models/course.model.js";

export const createCourse = async (req, res) => {
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
export const getCreatorCourse = async (req, res) => {
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

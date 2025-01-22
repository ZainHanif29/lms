import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const register = async (req, res) => {
  console.log("register");
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashPassword });
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Error in registration:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error: Register" });
  }
};

export const login = async (req, res) => {
  console.log("login");
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password 1.",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password 2.",
      });
    }

    generateToken(res, user, `Welcome back ${user.name}`);
  } catch (error) {
    console.error("Error in Login:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error: Login" });
  }
};

export const logout = async (req, res) => {
  console.log("logout");
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in Logout:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error: Logout" });
  }
};

export const getUserProfile = async (req, res) => {
  console.log("getUserProfile");
  try {
    const userID = req.id;
    const user = await User.findById({ _id: userID }).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "Profile not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Profile found",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in User Profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: User Profile Data",
    });
  }
};

export const updateProfile = async (req, res) => {
  console.log("updateProfile");
  try {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Profile not found",
        success: false,
      });
    }
    // extract public ID of the old image from the url is it exits;
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0]; // public ID
      deleteMediaFromCloudinary(publicId);
    }

    // upload new photo
    let photoUrl = "";
    if (profilePhoto) {
      const cloudResponse = await uploadMedia(profilePhoto.path);
      photoUrl = cloudResponse.secure_url;
    }

    const updatedData = { name, photoUrl };
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error in Update Profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: Update Profile Data",
    });
  }
};

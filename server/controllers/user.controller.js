import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
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
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error: Register" });
  }
};

export const login = async (req, res) => {
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
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error: Login" });
  }
};

export const logout = async () => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in Logout:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error: Logout" });
  }
};

export const getUserProfile = async (req, res) => {
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
    res.status(500).json({
      success: false,
      message: "Internal Server Error: User Profile Data",
    });
  }
};

const updateProfile = async (req, res) => {
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
  } catch (error) {
    console.error("Error in Update Profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error: Update Profile Data",
    });
  }
};

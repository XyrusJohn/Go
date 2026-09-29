import {
  createUser,
  findUserByIdentifier,
  findUserById,
  updateUserProfileData,
  updateUserPasswordData,
  updateProfilePicture,
} from "../models/auth.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "./../lib/utils.js";

import cloudinary from "../config/cloudinary.js";

export const register = async (req, res) => {
  try {
    // * NOTE: Already been sanitized from auth.validation
    const { role, lastName, firstName, middleInitial, email, password } =
      req.body;
    // * 1. Business logic, identify if the email have been used
    const existingUser = await findUserByIdentifier(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "The email is already been used" });
    }
    // * Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    // * Save the req to Model
    const newUser = await createUser({
      role,
      lastName,
      firstName,
      middleInitial,
      email,
      password: hashPassword,
    });

    if (newUser) {
      generateToken(newUser.id, res);

      return res.status(201).json({
        message: "Successful Registration",
        data: {
          id: newUser.id,
          username: newUser.username,
          lastName,
          firstName,
          middleInitial,
          email,
          role,
        },
      });
    }
  } catch (error) {
    console.error("Registration Error: ", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // * 1. FIND USERNAME
    const user = await findUserByIdentifier(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }
    // * 2. VALIDATE IF THE USER PUT THE RIGHT PASSWORD
    // Password validation
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password." });
    }
    // * GENERATE JWT TOKEN
    const token = generateToken(user.id, res);

    const { password: _, ...userData } = user;

    return res.status(200).json({
      message: "Login Successful",
      user: userData,
    });
  } catch (error) {
    console.error("Login Error: ", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  return res.status(200).json({
    message: "Logout Successful",
  });
};

export const checkAuth = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const { password: _, ...userData } = user;
    return res.status(200).json({
      message: "Authorize",
      data: userData,
    });
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const fetchUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: _, ...userData } = user;
    return res.status(200).json({
      message: "User profile fetched successfully",
      data: userData,
    });
  } catch (error) {
    console.error("Error in fetchUserProfile controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { lastName, firstName, middleInitial, phoneNumber, email } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!lastName || !firstName || !email) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const userProfileData = {
      lastName,
      firstName,
      middleInitial,
      phoneNumber,
      email,
    };
    if (!userProfileData) {
      return res.status(404).json({ message: "User not found" });
    }

    const userUpdatedData = await updateUserProfileData(
      userId,
      userProfileData,
    );

    if (!userUpdatedData) {
      return res.status(500).json({
        success: false,
        message: "Failed to update user profile",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: userUpdatedData,
    });
  } catch (error) {
    console.error("Error in updateUserProfile controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const userUpdatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid current password",
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedPassword = await updateUserPasswordData(
      userId,
      hashedPassword,
    );

    if (!updatedPassword) {
      return res.status(500).json({
        success: false,
        message: "Failed to update password",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error in userUpdatePassword controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUserProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: "go_avatar",
      gravity: "face",
      crop: "fill",
      width: 400,
      height: 400,
    });

    const profilePictureUrl = uploadResponse.secure_url;

    await updateProfilePicture(userId, profilePictureUrl);

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      profile_picture: profilePictureUrl,
    });
  } catch (error) {
    console.error(
      "Error in updateUserProfilePicture controller:",
      error.message,
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

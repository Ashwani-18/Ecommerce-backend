const express = require("express");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel");

// ===================== Signup =====================
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, answer } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      answer,
      role,
    });

    return res.status(201).json({
      message: "New user successfully created",
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      message: "Unable to register user",
      success: false,
    });
  }
};

// ===================== Login =====================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill in all required fields",
        success: false,
      });
    }

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password incorrect",
      });
    }

    // Generate JWT
    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    const token = JWT.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    // Convert Mongoose document to plain object
    const userObject = user.toObject();
    userObject.token = token;
    delete userObject.password;

    // Cookie options
    const options = {
      expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    // Send cookie and response
    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user: userObject,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Login failed",
      success: false,
    });
  }
};

// ===================== Forget Password =====================
exports.forget = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    // Validate input
    if (!email || !answer || !newPassword) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    // Check user by email and security answer
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).json({
        message: "Invalid email or answer",
        success: false,
      });
    }

    // Hash the new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // Update password in DB
    await userModel.findByIdAndUpdate(user._id, { password: hashed });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Forget Password Error:", error);
    return res.status(500).json({
      message: "Unable to reset password",
      success: false,
    });
  }
};

exports.UpdateProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password, answer } = req.body;

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (answer) updateData.answer = answer;
    if (password && password.length >= 6) {
      const hashed = await bcrypt.hash(password, 10);
      updateData.password = hashed;
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, select: '-password' }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Unable to update profile',
      success: false,
      error: error.message,
    });
  }
};
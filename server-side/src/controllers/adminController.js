const { comparePassword } = require("../helpers/hashPass");
const {
  jwtSecretKey,
  loginCodeAdmin,
  jwtExpirationTime,
} = require("../../secrets");
const { createJsonWebToken } = require("../helpers/jsonWebToken");
const User = require("../models/usermodel/userModel");
const UserProfile = require("../models/usermodel/userProfileModel");

require("dotenv").config();

// admin login
exports.adminLogin = async (req, res, next) => {
  try {
    // destructure email,password,loginCode from req.body
    const { email, password, loginCode } = req.body;

    // validation
    if (!email) {
      return res.json({ error: "Email is required" });
    }
    if (!password) {
      return res.json({ error: "Password is required" });
    }
    if (!loginCode) {
      return res.json({ error: "Login Code is required" });
    }
    // check if login code is okay
    if (loginCode !== loginCodeAdmin) {
      return res.json({ error: "Login Code is mismatched" });
    }

    // check if email is taken
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "User account not found" });
    }

    // check if the user is Locked
    if (user.isLocked == true) {
      return res.json({ error: "Your account is locked" });
    }

    // check if the user has reached the maximum login attempts
    if (user.isLoginTry >= 5) {
      // lock the user
      await User.findByIdAndUpdate(user._id, { isLocked: true });

      return res.json({
        error: "Your account has been locked due to multiple login attempts",
      });
    }

    // Compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      // increment the login attempt count
      await User.findByIdAndUpdate(user._id, { $inc: { isLoginTry: 1 } });

      return res.json({
        error: `Invalid email or password, ${
          5 - Number(user.isLoginTry)
        } login attempts left`,
      });
    }

    // reset login attempt count after successfully login
    await User.findByIdAndUpdate(user._id, { isLoginTry: 0 });

    // Update isAdmin field
    const updatedAdmin = await User.findByIdAndUpdate(
      user._id,
      {
        isAdmin: true,
      },
      { new: true }
    );

    const adminProfile = await UserProfile.findOne({ user: user._id });

    //generate token for admin
    const createdToken = createJsonWebToken(
      { _id: user._id, isAdmin: true },
      jwtSecretKey,
      jwtExpirationTime
    );

    res.status(200).json({
      status: "success",
      message: "Admin login successfully",
      createdToken,
      admin: {
        username: updatedAdmin.username,
        email: updatedAdmin.email,
        isAdmin: updatedAdmin.isAdmin,
        image: adminProfile.image,
        isLoginTry: updatedAdmin.isLoginTry,
      },
    });
  } catch (error) {
    next(error);
    console.log(error.message);
  }
};

// admin get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    // retrieve all users with isAdmin set to false
    const users = await User.find({ isAdmin: false });

    res.status(200).json({ status: "success", users });
  } catch (error) {
    next(error);
    console.log(error.message);
  }
};

// admin get user by id
exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // find the user
    const user = await User.findById(userId);

    // check user is not found or is an admin (admin cannot be deleted)
    if (!user || user.isAdmin == true) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    res.status(200).json({ status: "success", user });
  } catch (error) {
    next(error);
    console.log(error.message);
  }
};

// update lock user by id
exports.updateLock = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { isLocked } = req.body;

    // find the user by id
    const user = await User.findById(userId);

    if (!isLocked) {
      return res
        .status(404)
        .json({ status: "error", message: "Invalid request" });
    }

    const lockStatus = isLocked === "true" ? true : false;

    // check if the user exists
    if (!user || user.isAdmin == true) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    // update the user (locked)
    await User.findByIdAndUpdate(user._id, { isLocked: lockStatus });

    res.status(200).json({
      status: "success",
      message: `${
        lockStatus
          ? "User account locked successfully"
          : "User account unlocked successfully"
      }`,
    });
  } catch (error) {
    next(error);
    console.log(error.message);
  }
};

// update ban user by id
exports.updateBan = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // find the user by id
    const user = await User.findById(userId);

    // check if the user exists
    if (!user || user.isAdmin == true) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    // update the user (banned)
    await User.findByIdAndUpdate(user._id, { isBanned: true });

    res.status(200).json({
      status: "success",
      message: "User has been Banned",
    });
  } catch (error) {
    next(error);
    console.log(error.message);
  }
};

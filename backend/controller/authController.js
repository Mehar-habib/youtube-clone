import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";
import sendEmail from "../config/sendMail.js";

export const signUp = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    let photoUrl;
    if (req.file) {
      photoUrl = await uploadOnCloudinary(req.file.path);
    }
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exist" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userName,
      email,
      password: hashPassword,
      photoUrl,
    });

    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      samesite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      samesite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const signOut = async (req, res) => {
  try {
    await res.clearCookie("token");
    return res.status(200).json({ message: "Sign out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { userName, email, photoUrl } = req.body;
    let googlePhoto = photoUrl;
    if (photoUrl) {
      try {
        googlePhoto = await uploadOnCloudinary(photoUrl);
      } catch (error) {
        console.log("Cloudinary upload failed!");
      }
    }
    const user = await User.findOne({ email });
    if (!user) {
      await User.create({
        userName,
        email,
        photoUrl: googlePhoto,
      });
    } else {
      if (!user.photoUrl && googlePhoto) {
        user.photoUrl = googlePhoto;
        await user.save();
      }
    }
    let token = await genToken(user?._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      samesite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Reset Password
export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;

    await user.save();
    sendEmail(email, otp);
    return res.status(200).json({ message: "Otp sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid otp" });
    }
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    user.isOtpVerified = true;
    await user.save();
    return res.status(200).json({ message: "Otp verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "OTP verification required" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    user.isOtpVerified = false;
    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

import {
  createOtp,
  findUserOtpData,
  clearOtpData,
} from "../models/otp.model.js";
import { transporter } from "../config/mailer.js";

import crypto from "crypto";

export const generateOtp = async (req, res) => {
  try {
    const userId = req.user.id;
    // const userId = 100000000;

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // const otpData = {
    //   otp,
    //   otpExpires,
    //   userId,
    // };

    await createOtp(otp, otpExpires, userId);

    const mailOption = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "SnapGo - Profile Edit Verification Code",
      html: `
              <div style="font-family: sans-serif; padding: 20px;">
                <h2>Verification Code</h2>
                <p>You requested to edit your profile information. Your One-Time Password (OTP) is:</p>
                <h1 style="color: #9A0AED; letter-spacing: 5px;">${otp}</h1>
                <p>This code is valid for <strong>5 minutes</strong>. Do not share this code with anyone.</p>
              </div>
            `,
    };

    await transporter.sendMail(mailOption);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email.",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while sending OTP.",
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { otp, email } = req.body;

  if (!otp || !email) {
    return res.status(400).json({
      success: false,
      message: "OTP and email are required",
    });
  }

  const user = await findUserOtpData(email);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (!user.edit_otp || !user.edit_otp_expires) {
    return res.status(400).json({
      success: false,
      message: "No Active OTP",
    });
  }

  if (new Date() > new Date(user.edit_otp_expires)) {
    return res.status(400).json({
      success: false,
      message: "OTP expired. Please try again.",
    });
  }

  if (user.edit_otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP code. Please try again.",
    });
  }

  await clearOtpData(user.id);
  return res.status(200).json({
    success: true,
    message: "OTP verified successfully",
  });
};

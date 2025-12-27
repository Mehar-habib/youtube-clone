import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER_Email,
    pass: process.env.PASSWORD,
  },
});

const sendEmail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `"YouTube Clone" <${process.env.USER_Email}>`,
      to: to,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #202124; color: #fff; padding: 20px; max-width: 600px; margin: auto; border-radius: 10px; border: 1px solid #2a2a2a;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" alt="YouTube Logo" style="width: 100px;"/>
            <h2 style="margin: 10px 0; font-size: 24px; color: #FF0000;">YouTube Clone</h2>
          </div>
          <p style="font-size: 16px;">Hi,</p>
          <p style="font-size: 16px;">You requested to reset your password. Use the OTP below to reset it:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 28px; font-weight: bold; background-color: #ff0000; padding: 10px 20px; border-radius: 8px; letter-spacing: 4px;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 14px; color: #ccc; text-align: center; margin-bottom: 10px;">
            <strong>Note:</strong> OTP will expire after 5 minutes.
          </p>
          <p style="font-size: 14px; color: #ccc;">If you did not request a password reset, please ignore this email.</p>
          <p style="font-size: 14px; color: #ccc; margin-top: 30px;">Thank you,<br/>YouTube Clone Team</p>
        </div>
      `,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendEmail;

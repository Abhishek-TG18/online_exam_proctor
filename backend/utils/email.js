const { EMAIL_PASSWORD, EMAIL_USER } = require("../config");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "Modernizing laboratory assessment - Email Verification OTP",
    html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #003366;">Modernizing laboratory assessment Email Verification</h2>
            <p>Dear New User,</p>
            <p>Your OTP for email verification is:</p>
            <h1 style="color: #003366; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
            <p>This OTP will expire in 5 minutes.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
            <hr>
            <p style="font-size: 12px; color: #666;">
              This is an automated message from SIT. Please do not reply to this email.
            </p>
          </div>
        `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { generateOTP, sendOTPEmail };

const nodeMailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async (email, html) => {
  let transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: '"CuaHangDienTu" <no-reply>@gmail.com', // sender address
    to: email,
    subject: "Forgot password", // Subject line
    html: html,
  });
  return info;
});
module.exports = sendEmail;

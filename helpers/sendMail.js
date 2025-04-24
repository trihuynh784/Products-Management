const nodemailer = require("nodemailer");

module.exports.register = async (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_KEY,
    },
  });

  await transporter.sendMail({
    from: `"OTP REGISTER ACCOUNT 👻👻👻" <${process.env.EMAIL_NAME}>`, // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: html, // html body
  });
};

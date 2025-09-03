const nodeMailer = require("nodemailer");

require("dotenv").config();

const sendMail = async (to, subject, text) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.PASS_USER,
    },
  });
  const mailOption = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };
  try {
    await transporter.sendMail(mailOption);
    console.log("Mail is sent to", to);
  } catch (error) {
    console.log("unable to send the mail");
  }
};

module.exports = sendMail;

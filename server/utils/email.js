import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  return transporter.sendMail({
    from: `"StockMaster" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
};

const nodemailer = require('nodemailer');

/**
 * Sends an email using Nodemailer.
 * If process.env.EMAIL_TO_TERMINAL is 'true', prints the email content to the terminal instead of sending.
 * 
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 */
const sendEmail = async (options) => {
  let transporter;

  if (process.env.EMAIL_TO_TERMINAL === 'true') {
    // Development: Print email to terminal instead of sending
    transporter = nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true,
    });
  } else {
    // Production: Send real email via SMTP
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: process.env.SERVICE,
      port: 465,
      secure: true, // true for port 465, false for other ports
      auth: {
        user: process.env.APP_USERNAME,
        pass: process.env.APP_PASSWORD
      },
    });
  }

  try {
    const info = await transporter.sendMail({
      from: `America <${process.env.APP_USERNAME}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    });

    if (process.env.EMAIL_TO_TERMINAL === 'true') {
      console.log("=== EMAIL CONTENT (not sent) ===\n" + info.message.toString());
    } else {
      console.log("Message sent: %s", info.messageId);
    }
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

module.exports = sendEmail;
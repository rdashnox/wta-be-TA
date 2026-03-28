const nodemailer = require("nodemailer");
const config = require("../config/config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.gmailUser,
    pass: config.gmailAppPass,
  },
});

/**
 * Sends an email.
 *
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} [options.text] - Optional plain text content
 */
exports.sendMail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Sky Suites" <${config.gmailUser}>`,
      to,
      subject,
      html,
      text: text || "", // fallback to empty string if not provided
    });

    return info;
  } catch (error) {
    throw new Error(error.message || "Email sending failed");
  }
};

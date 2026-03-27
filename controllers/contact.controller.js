const config = require("../config/config");
const nodemailer = require("nodemailer");
const Contact = require("../models/Contact");
const { verifyEmail } = require("../utils/emailVerifier");
const logger = require("../utils/logger");

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.gmailUser,
    pass: config.gmailAppPass,
  },
});

exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Please enter all required fields: name, email, and message.",
      });
    }

    await verifyEmail(email);

    const newContactMessage = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    // ADMIN EMAIL - Fixed format + variables
    await transporter.sendMail({
      from: `"Contact Form" <${config.gmailUser}>`,
      to: config.adminEmail,
      subject: `🔔 New Contact: ${subject}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
      text: `New Contact: ${subject}\nName: ${name}\nEmail: ${email}\n${message}`,
    });

    // CONFIRMATION EMAIL - ALL VARIABLES FIXED
    await transporter.sendMail({
      from: `"Support Team" <${config.adminEmail}>`,
      to: email,
      replyTo: config.gmailUser,
      subject: `Re: ${subject}`,
      html: `
        <h3>Thank You!</h3>
        <p>Hi <strong>${name}</strong>,</p>
        <p>We've received your message "${subject}".</p>
        <p>Reply within 24 hours.</p>
        <p>Regards,<br>Sky Suites Hotel Support Team</p>
      `,
      text: `Hi ${name},\n\nThank you for "${subject}". We'll reply soon!\n\nSky Suites Hotel Support Team`,
    });

    res.status(201).json({
      message: "Contact message sent successfully!",
      contact: newContactMessage,
    });
  } catch (error) {
    logger.error("Email Error:", error.response?.data || error.message);
    logger?.error(`Contact error: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

exports.getAllContactMessages = async (req, res) => {
  try {
    // Find all contact messages and sort them by creation date in descending order (newest first)
    const messages = await Contact.find().sort({ createdAt: -1 });

    // Return the fetched messages
    res.status(200).json({
      count: messages.length,
      messages,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.markMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params; // Get the message ID from the URL parameters

    // Find the message by ID and update its status to "read"
    const updatedMessage = await Contact.findByIdAndUpdate(
      id,
      { status: "read" },
      { new: true, runValidators: true },
    );

    // If no message is found with the given ID, return a 404 error
    if (!updatedMessage) {
      return res.status(404).json({ message: "Contact message not found." });
    }

    // Return a success response with the updated message
    res.status(200).json({
      message: "Contact message marked as read successfully!",
      contact: updatedMessage,
    });
  } catch (error) {
    // Handle invalid ID format or other errors
    res.status(400).json({ message: error.message });
  }
};

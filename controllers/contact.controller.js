const Contact = require("../models/Contact");
const { verifyEmail } = require("../utils/emailVerifier");
const { sendMail } = require("../services/emailService");
const config = require("../config/config");
const logger = require("../utils/logger");

exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Please enter all required fields: name, email, and message.",
      });
    }

    // Always notify admin first
    try {
      await sendMail({
        to: config.adminEmail,
        subject: `🔔 New Contact Attempt: ${subject}`,
        html: `
          <h3>New Contact Attempt</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong><br>${message}</p>
        `,
        text: `New Contact Attempt: ${subject}\nName: ${name}\nEmail: ${email}\n${message}`,
      });
    } catch (adminEmailError) {
      logger.warn(`Admin notification failed: ${adminEmailError.message}`);
    }

    // Verify email using external API
    await verifyEmail(email);

    // Check if email already exists in DB
    const existingContact = await Contact.findOne({ email, subject, message });

    if (existingContact) {
      return res.status(200).json({
        message:
          "You have already sent this message. Admin has been notified again.",
        contact: existingContact,
      });
    }

    // Save new contact message
    const newContactMessage = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    // Send confirmation email to user after saving
    try {
      await sendMail({
        to: email,
        subject: `Re: ${subject}`,
        html: `
          <h3>Thank You!</h3>
          <p>Hi <strong>${name}</strong>,</p>
          <p>We've received your message "${subject}".</p>
          <p>We will reply within 24 hours.</p>
          <p>Regards,<br><a href="https://wta-fe.web.app" target="_blank" rel="noopener noreferrer">Sky Suites Hotel Support Team</a></p>
        `,
        text: `Hi ${name},\n\nThank you for "${subject}". We'll reply within 24 hours.\n\nSky Suites Hotel Support Team`,
      });
    } catch (userEmailError) {
      logger.warn(`User confirmation email failed: ${userEmailError.message}`);
    }

    res.status(201).json({
      message: "Contact message sent successfully!",
      contact: newContactMessage,
    });
  } catch (error) {
    logger.error(`Contact error: ${error.response?.data || error.message}`);
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

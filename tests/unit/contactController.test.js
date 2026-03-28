const mongoose = require("mongoose");

// reset module registry
jest.resetModules();

jest.mock("../../utils/emailVerifier", () => ({
  verifyEmail: jest.fn().mockResolvedValue(true),
}));

jest.mock("nodemailer", () => {
  const mockSendMail = jest.fn().mockResolvedValue(true);
  return {
    createTransport: jest.fn(() => ({
      sendMail: mockSendMail,
    })),
  };
});

const {
  createContactMessage,
  getAllContactMessages,
  markMessageAsRead,
} = require("../../controllers/contact.controller");

const Contact = require("../../models/Contact");
const nodemailer = require("nodemailer");

const { connectTestDB, clearDB, disconnectDB } = require("../testSetup");

// Get access to sendMail mock
const sendMailMock = nodemailer.createTransport().sendMail;

jest.setTimeout(20000);

describe("Contact Controller Unit Tests", () => {
  beforeAll(async () => await connectTestDB());

  afterEach(async () => {
    await clearDB();
    jest.clearAllMocks(); // reset mocks between tests
  });

  afterAll(async () => await disconnectDB());

  describe("createContactMessage", () => {
    it("should create contact message with valid data", async () => {
      const req = {
        body: {
          name: "John Doe",
          email: "jdoe@example.com",
          subject: "Test Subject",
          message: "Test Message",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const mockContact = {
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
        status: "new",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // DB mock
      jest.spyOn(Contact, "create").mockResolvedValue(mockContact);

      await createContactMessage(req, res);

      expect(Contact.create).toHaveBeenCalledWith({
        name: "John Doe",
        email: "jdoe@example.com",
        subject: "Test Subject",
        message: "Test Message",
      });

      // Emails sent twice
      expect(sendMailMock).toHaveBeenCalledTimes(2);

      // Response correct
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Contact message sent successfully!",
        contact: mockContact,
      });
    });

    it("should reject missing required fields", async () => {
      const req = {
        body: {
          name: "Jerry Doe",
          subject: "Missing Fields Test",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await createContactMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Please enter all required fields: name, email, and message.",
      });

      expect(Contact.create).not.toHaveBeenCalled();

      expect(sendMailMock).not.toHaveBeenCalled();
    });
  });

  describe("getAllContactMessages", () => {
    it("should return all contact messages", async () => {
      const mockMessages = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: "John Doe",
          email: "john@example.com",
          subject: "Subject 1",
          message: "Message 1",
          status: "new",
          createdAt: new Date(),
        },
        {
          _id: new mongoose.Types.ObjectId(),
          name: "Jerry Doe",
          email: "jerry@example.com",
          subject: "Subject 2",
          message: "Message 2",
          status: "read",
          createdAt: new Date(),
        },
      ];

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      jest.spyOn(Contact, "find").mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockMessages),
      });

      await getAllContactMessages(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        count: 2,
        messages: mockMessages,
      });
    });
  });

  describe("markMessageAsRead", () => {
    it("should mark message as read", async () => {
      const messageId = new mongoose.Types.ObjectId();

      const req = { params: { id: messageId.toString() } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const updatedMessage = {
        _id: messageId,
        name: "John Doe",
        email: "john@example.com",
        subject: "Subject 1",
        message: "Message 1",
        status: "read",
        createdAt: new Date(),
      };

      jest
        .spyOn(Contact, "findByIdAndUpdate")
        .mockResolvedValue(updatedMessage);

      await markMessageAsRead(req, res);

      expect(Contact.findByIdAndUpdate).toHaveBeenCalledWith(
        messageId.toString(),
        { status: "read" },
        { new: true, runValidators: true },
      );

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 for non-existent message", async () => {
      const req = { params: { id: "nonexistent" } };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      jest.spyOn(Contact, "findByIdAndUpdate").mockResolvedValue(null);

      await markMessageAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Contact message not found.",
      });
    });
  });
});

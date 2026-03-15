/*
 * for @Gracielleee
 */

const mongoose = require("mongoose");
const {
  createContactMessage,
  getAllContactMessages,
  markMessageAsRead,
} = require("../../controllers/contact.controller");
const Contact = require("../../models/Contact");
const { connectTestDB, clearDB, disconnectDB } = require("../testSetup");

jest.setTimeout(20000);

describe("Contact Controller Unit Tests", () => {
  beforeAll(async () => await connectTestDB());
  afterEach(async () => await clearDB());
  afterAll(async () => await disconnectDB());

  describe("createContactMessage", () => {
    it("should create contact message with valid data", async () => {
      // TODO 1: Setup req.body with name, email, subject, message
      const req = {body: {
          name: "John Doe",
          email: "jdoe@example.com",
          subject: "Test Subject",
          message: "Test Message"
        }
      };

      // TODO 2: Mock res with status().json()
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      // TODO 3: Mock Contact.create to return fake contact
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

      /* YOUR CODE HERE - Contact.create = jest.fn().mockResolvedValue() */
      Contact.create = jest.fn().mockResolvedValue(mockContact);
      await createContactMessage(req, res);

      // TODO 4: Check Contact.create called with req.body
      expect(Contact.create).toHaveBeenCalledWith({
        name: "John Doe",
        email: "jdoe@example.com",
        subject: "Test Subject",
        message: "Test Message",
      });

      // TODO 5: Check status 201 and correct response
      expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
        message: "Contact message sent successfully!",
        contact: mockContact,
        });

        Contact.create.mockRestore();
      });
    });

    it("should reject missing required fields", async () => {
      // TODO: req.body missing email/message, expect status 400
      const req = { body: { name: "Jerry Doe" , subject: "Missing Fields Test" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await createContactMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Please enter all required fields: name, email, and message.",
      });
    });
  });

  describe("getAllContactMessages", () => {
    it("should return all contact messages", async () => {
      // HINT: Mock Contact.find().sort()
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

      // TODO: Mock Contact.find().sort() chain
      Contact.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockMessages)
      });
      
      await getAllContactMessages(req, res);

      // TODO: Check response has count: 2, messages array
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        count: 2,
        messages: mockMessages,
      });
      Contact.find.mockRestore();
    });
  });

  describe("markMessageAsRead", () => {
    it("should mark message as read", async () => {
      // TODO 1: req.params.id = "123"
      const messageId = new mongoose.Types.ObjectId();
      const req = { params: { id: messageId.toString() } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      // TODO 2: Mock Contact.findByIdAndUpdate
      const updatedMessage = {
        _id: messageId,
        name: "John Doe",
        email: "john@example.com",
        subject: "Subject 1",
        message: "Message 1",
        status: "read",
        createdAt: new Date(),
      };
      
      Contact.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedMessage);

      await markMessageAsRead(req, res);

      // TODO 3: Check exact arguments: id, {status: "read"}, {new: true, runValidators: true}
      expect(Contact.findByIdAndUpdate).toHaveBeenCalledWith(
        messageId.toString(),
        { status: "read" },
        { new: true, runValidators: true }
      );
    });

    it("should return 404 for non-existent message", async () => {
      // TODO: Mock findByIdAndUpdate to return null → expect 404
      const req = { params: { id: "nonexistent" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      Contact.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await markMessageAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Contact message not found.",
      });

      Contact.findByIdAndUpdate.mockRestore();
      });
  });

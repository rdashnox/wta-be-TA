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
  beforeAll(async () => {
    await connectTestDB();
  });

  afterEach(async () => {
    await clearDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  describe("createContactMessage", () => {
    it("should create contact message with valid data", async () => {
      const req = {
        body: {
          name: "John Doe",
          email: "john@example.com",
          subject: "Inquiry",
          message: "Hello, I have a question!",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock Contact.create
      const mockContact = { id: "123", name: "John Doe" };
      Contact.create = jest.fn().mockResolvedValue(mockContact);

      await createContactMessage(req, res);

      expect(Contact.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Contact message sent successfully!",
        contact: mockContact,
      });
    });

    it("should reject missing required fields", async () => {
      const req = { body: { name: "John" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createContactMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Please enter all required fields: name, email, and message.",
      });
    });

    it("should handle mongoose validation errors", async () => {
      const req = {
        body: {
          name: "John",
          email: "invalid-email",
          message: "Test",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Contact.create = jest
        .fn()
        .mockRejectedValue(new Error("ValidationError"));

      await createContactMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("getAllContactMessages", () => {
    it("should return all contact messages", async () => {
      const mockMessages = [
        { id: "1", name: "John" },
        { id: "2", name: "Jane" },
      ];

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Contact.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockMessages),
      });

      await getAllContactMessages(req, res);

      expect(Contact.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        count: 2,
        messages: mockMessages,
      });
    });
  });

  describe("markMessageAsRead", () => {
    it("should mark message as read", async () => {
      const req = { params: { id: "123" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const mockUpdated = { id: "123", status: "read" };
      Contact.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdated);

      await markMessageAsRead(req, res);

      expect(Contact.findByIdAndUpdate).toHaveBeenCalledWith(
        "123",
        { status: "read" },
        { new: true, runValidators: true },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Contact message marked as read successfully!",
        contact: mockUpdated,
      });
    });

    it("should return 404 for non-existent message", async () => {
      const req = { params: { id: "123" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Contact.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await markMessageAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Contact message not found.",
      });
    });
  });
});

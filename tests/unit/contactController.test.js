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
      const req = {
        /* YOUR CODE HERE */
      };

      // TODO 2: Mock res with status().json()
      const res = {
        /* YOUR CODE HERE */
      };

      // TODO 3: Mock Contact.create to return fake contact
      const mockContact = {
        /* YOUR CODE HERE */
      };
      /* YOUR CODE HERE - Contact.create = jest.fn().mockResolvedValue() */

      await createContactMessage(req, res);

      // TODO 4: Check Contact.create called with req.body
      // TODO 5: Check status 201 and correct response
      /* YOUR CODE HERE */
    });

    it("should reject missing required fields", async () => {
      // TODO: req.body missing email/message, expect status 400
      /* YOUR CODE HERE */
    });
  });

  describe("getAllContactMessages", () => {
    it("should return all contact messages", async () => {
      // HINT: Mock Contact.find().sort()
      const mockMessages = [
        /* YOUR CODE HERE */
      ];

      const req = {};
      const res = {
        /* YOUR CODE HERE */
      };

      // TODO: Mock Contact.find().sort() chain
      /* YOUR CODE HERE:
      Contact.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockMessages)
      });
      */

      await getAllContactMessages(req, res);

      // TODO: Check response has count: 2, messages array
      /* YOUR CODE HERE */
    });
  });

  describe("markMessageAsRead", () => {
    it("should mark message as read", async () => {
      // TODO 1: req.params.id = "123"
      // TODO 2: Mock Contact.findByIdAndUpdate
      // TODO 3: Check exact arguments: id, {status: "read"}, {new: true, runValidators: true}
      /* YOUR CODE HERE */
    });

    it("should return 404 for non-existent message", async () => {
      // TODO: Mock findByIdAndUpdate to return null → expect 404
      /* YOUR CODE HERE */
    });
  });
});

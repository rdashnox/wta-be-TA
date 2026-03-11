const mongoose = require("mongoose");
const {
  subscribe,
  unsubscribe,
  getAllSubscriptions,
  sendNewsletter,
} = require("../../controllers/subscription.controller");
const Subscription = require("../../models/Subscription");
const { connectTestDB, clearDB, disconnectDB } = require("../testSetup");

jest.setTimeout(20000);

describe("Subscription Controller Unit Tests", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterEach(async () => {
    await clearDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  describe("subscribe", () => {
    it("should subscribe new email successfully", async () => {
      const req = {
        body: { email: "new@example.com" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await subscribe(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      const createdSub = res.json.mock.calls[0][0];
      expect(createdSub.email).toBe("new@example.com");
      expect(createdSub.status).toBe("active");
    });

    it("should reject already subscribed email", async () => {
      const req = { body: { email: "existing@example.com" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Create existing subscription first
      await Subscription.create({ email: "existing@example.com" });

      await subscribe(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email is already subscribed",
      });
    });
  });

  describe("unsubscribe", () => {
    it("should unsubscribe existing email", async () => {
      // Create subscription first
      const testSub = await Subscription.create({ email: "user@example.com" });

      const req = { body: { email: "user@example.com" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await unsubscribe(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const result = res.json.mock.calls[0][0];
      expect(result.status).toBe("unsubscribed");
    });

    it("should return 404 for non-existent subscription", async () => {
      const req = { body: { email: "nonexistent@example.com" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await unsubscribe(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Subscription not found",
      });
    });
  });

  describe("getAllSubscriptions", () => {
    it("should return all subscriptions", async () => {
      await Subscription.create([
        { email: "test1@example.com" },
        { email: "test2@example.com" },
      ]);

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await getAllSubscriptions(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const result = res.json.mock.calls[0][0];
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });
  });

  describe("sendNewsletter", () => {
    it("should return active subscribers count", async () => {
      await Subscription.create([
        { email: "active1@example.com", status: "active" },
        { email: "inactive@example.com", status: "unsubscribed" },
      ]);

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await sendNewsletter(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const result = res.json.mock.calls[0][0];
      expect(result.recipientCount).toBe(1);
    });
  });
});

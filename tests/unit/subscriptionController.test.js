const {
  subscribe,
  unsubscribe,
  getAllSubscriptions,
  sendNewsletter,
} = require("../../controllers/subscription.controller");
const Subscription = require("../../models/Subscription");
const axios = require("axios");
const { connectTestDB, clearDB, disconnectDB } = require("../testSetup");

jest.mock("axios"); // Mock all axios calls

jest.setTimeout(20000);

describe("Subscription Controller Unit Tests", () => {
  beforeAll(async () => await connectTestDB());
  afterEach(async () => await clearDB());
  afterAll(async () => await disconnectDB());

  describe("subscribe", () => {
    it("should subscribe new email successfully", async () => {
      // Mock successful API response
      axios.get.mockResolvedValue({
        data: { status: "passed" }, // Minimal valid response
      });

      const req = { body: { email: "user4.wta@maildrop.cc" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await subscribe(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "user4.wta@maildrop.cc",
          status: "active",
        }),
      );
    });

    it("should reject already subscribed email", async () => {
      axios.get.mockResolvedValue({ data: { status: "passed" } });

      await Subscription.create({
        email: "user4.wta@maildrop.cc",
        status: "active",
      });

      const req = { body: { email: "user4.wta@maildrop.cc" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await subscribe(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email already subscribed.", 
      });
    });
  });

  describe("unsubscribe", () => {
    it("should unsubscribe existing email", async () => {
      axios.get.mockResolvedValue({ data: { status: "passed" } });

      await Subscription.create({
        email: "user4.wta@maildrop.cc",
        status: "active",
      });

      const req = { body: { email: "user4.wta@maildrop.cc" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await unsubscribe(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "user4.wta@maildrop.cc",
          status: "unsubscribed",
        }),
      );
    });

    it("should return 404 for non-existent subscription", async () => {
      axios.get.mockResolvedValue({ data: { status: "passed" } });

      const req = { body: { email: "nonexistent@maildrop.cc" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await unsubscribe(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Subscription not found",
      });
    });
  });

  describe("getAllSubscriptions", () => {
    it("should return all subscriptions", async () => {
      await Subscription.create({ email: "test1@maildrop.cc" });
      await Subscription.create({ email: "test2@maildrop.cc" });

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await getAllSubscriptions(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ email: "test1@maildrop.cc" }),
          expect.objectContaining({ email: "test2@maildrop.cc" }),
        ]),
      );
    });
  });

  describe("sendNewsletter", () => {
    it("should return active subscribers count", async () => {
      await Subscription.create({
        email: "active@maildrop.cc",
        status: "active",
      });
      await Subscription.create({
        email: "unsubscribed@maildrop.cc",
        status: "unsubscribed",
      });

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await sendNewsletter(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Newsletter simulation successful",
        recipientCount: 1,
      });
    });
  });
});

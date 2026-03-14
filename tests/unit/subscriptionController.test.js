/* 
* for @Gracielleee
*/
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
  beforeAll(async () => await connectTestDB());
  afterEach(async () => await clearDB());
  afterAll(async () => await disconnectDB());

  describe("subscribe", () => {
    it("should subscribe new email successfully", async () => {
      const req = { body: { email: "new@example.com" } };
      const res = { 
        /* TODO: Mock res.status().json() */
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      // TODO: Call subscribe
      await subscribe(req, res);

      // TODO: Check status 201, email matches, status="active"
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "new@example.com",
          status: "active",
        })
      );
    });

    it("should reject already subscribed email", async () => {
      // HINT: Create existing subscription first with Subscription.create()
      await Subscription.create({ email: "existing@example.com" });

      const req = { body: { email: "existing@example.com" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      /* TODO: await Subscription.create() */
      await subscribe(req, res);

      /* TODO: expect status 400, message: "Email is already subscribed" */
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email is already subscribed",
      });
    });
  });

  describe("unsubscribe", () => {
    it("should unsubscribe existing email", async () => {
      // TODO 1: Create test subscription first
      const subscription = await Subscription.create({
        email: "unsub@example.com",
        status: "active",
      });

      // TODO 2: Call unsubscribe with that email
      const req = { body: { email: "unsub@example.com" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await unsubscribe(req, res);

      // TODO 3: Check result.status === "unsubscribed"
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "unsub@example.com",
          status: "unsubscribed",
        })
      );

    });

    it("should return 404 for non-existent subscription", async () => {
      // TODO: Try unsubscribe non-existent email → expect 404
      const req = { body: { email: "nonexistent@example.com" } };
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
      // TODO 1: Create 2 test subscriptions
      await Subscription.create({ email: "test1@example.com" });
      await Subscription.create({ email: "test2@example.com" });

      // TODO 2: Call getAllSubscriptions
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await getAllSubscriptions(req, res);

      // TODO 3: Check array length === 2
      expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ email: "test1@example.com" }),
        expect.objectContaining({ email: "test2@example.com" }),
      ])
    );

    });
  });

  describe("sendNewsletter", () => {
    it("should return active subscribers count", async () => {
      // HINT: Create 1 active + 1 unsubscribed subscription
      // TODO: Check recipientCount === 1 (only active ones)
      await Subscription.create({ email: "active@example.com", status: "active" });
      await Subscription.create({ email: "unsubscribed@example.com", status: "unsubscribed" });

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

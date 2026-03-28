// Reset module cache
jest.resetModules();

// MOCK email verifier (NO axios calls)
jest.mock("../../utils/emailVerifier", () => ({
  verifyEmail: jest.fn().mockResolvedValue(true),
}));

// MOCK email service (NO real emails)
jest.mock("../../services/emailService", () => ({
  sendMail: jest.fn().mockResolvedValue(true),
}));

const {
  subscribe,
  unsubscribe,
  getAllSubscriptions,
  sendNewsletter,
} = require("../../controllers/subscription.controller");

const Subscription = require("../../models/Subscription");
const { sendMail } = require("../../services/emailService");

const { connectTestDB, clearDB, disconnectDB } = require("../testSetup");

jest.setTimeout(20000);

describe("Subscription Controller Unit Tests", () => {
  beforeAll(async () => await connectTestDB());

  afterEach(async () => {
    await clearDB();
    jest.clearAllMocks(); // reset mocks
  });

  afterAll(async () => await disconnectDB());

  describe("subscribe", () => {
    it("should subscribe new email successfully", async () => {
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

      // Email sent
      expect(sendMail).toHaveBeenCalledTimes(1);
    });

    it("should reject already subscribed email", async () => {
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

      // No email sent
      expect(sendMail).not.toHaveBeenCalled();
    });

    it("should resubscribe unsubscribed email", async () => {
      await Subscription.create({
        email: "user4.wta@maildrop.cc",
        status: "unsubscribed",
      });

      const req = { body: { email: "user4.wta@maildrop.cc" } };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await subscribe(req, res);

      expect(res.status).toHaveBeenCalledWith(201);

      // Email sent
      expect(sendMail).toHaveBeenCalledTimes(1);
    });
  });

  // =============================
  // UNSUBSCRIBE
  // =============================
  describe("unsubscribe", () => {
    it("should unsubscribe existing email", async () => {
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

      // ✅ Email sent
      expect(sendMail).toHaveBeenCalledTimes(1);
    });

    it("should return 404 for non-existent subscription", async () => {
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

      expect(sendMail).not.toHaveBeenCalled();
    });

    it("should reject already unsubscribed email", async () => {
      await Subscription.create({
        email: "user4.wta@maildrop.cc",
        status: "unsubscribed",
      });

      const req = { body: { email: "user4.wta@maildrop.cc" } };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await unsubscribe(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Already unsubscribed",
      });

      expect(sendMail).not.toHaveBeenCalled();
    });
  });

  // =============================
  // GET ALL
  // =============================
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

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ email: "test1@maildrop.cc" }),
          expect.objectContaining({ email: "test2@maildrop.cc" }),
        ]),
      );
    });
  });

  // =============================
  // NEWSLETTER
  // =============================
  describe("sendNewsletter", () => {
    it("should return active subscribers count", async () => {
      await Subscription.create({
        email: "active@maildrop.cc",
        status: "active",
      });

      await Subscription.create({
        email: "inactive@maildrop.cc",
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

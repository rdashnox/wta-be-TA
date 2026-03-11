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
      const res = { /* TODO: Mock res.status().json() */ };

      // TODO: Call subscribe
      await /* YOUR CODE HERE */;

      // TODO: Check status 201, email matches, status="active"
      /* YOUR CODE HERE */
    });

    it("should reject already subscribed email", async () => {
      // HINT: Create existing subscription first with Subscription.create()
      /* TODO: await Subscription.create() */
      /* TODO: expect status 400, message: "Email is already subscribed" */
    });
  });

  describe("unsubscribe", () => {
    it("should unsubscribe existing email", async () => {
      // TODO 1: Create test subscription first
      // TODO 2: Call unsubscribe with that email
      // TODO 3: Check result.status === "unsubscribed"
      /* YOUR CODE HERE */
    });

    it("should return 404 for non-existent subscription", async () => {
      // TODO: Try unsubscribe non-existent email → expect 404
      /* YOUR CODE HERE */
    });
  });

  describe("getAllSubscriptions", () => {
    it("should return all subscriptions", async () => {
      // TODO 1: Create 2 test subscriptions
      // TODO 2: Call getAllSubscriptions
      // TODO 3: Check array length === 2
      /* YOUR CODE HERE */
    });
  });

  describe("sendNewsletter", () => {
    it("should return active subscribers count", async () => {
      // HINT: Create 1 active + 1 unsubscribed subscription
      // TODO: Check recipientCount === 1 (only active ones)
      /* YOUR CODE HERE */
    });
  });
});

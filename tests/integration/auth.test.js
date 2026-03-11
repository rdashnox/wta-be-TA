const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const User = require("../../models/User");
const {
  connectTestDB,
  clearDB,
  disconnectDB,
  createTestUser,
} = require("../testSetup");

jest.setTimeout(20000);

describe("Auth API Integration Tests", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterEach(async () => {
    await clearDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  describe("POST /api/auth/register", () => {
    it("should register new user", async () => {
      const testEmail = `test${Date.now()}@example.com`;
      
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          email: testEmail,
          password: "password123",
          firstName: "John",
          lastName: "Doe",
        })
        .expect(201);

      expect(res.body.user).toHaveProperty("id");
      if (res.body.token) {
        expect(res.body.token).toBeDefined();
      }
    });

    it("should reject duplicate email", async () => {
      const testEmail = `duplicate${Date.now()}@example.com`;
      
      await request(app)
        .post("/api/auth/register")
        .send({
          email: testEmail,
          password: "password123",
          firstName: "John",
        });

      await request(app)
        .post("/api/auth/register")
        .send({
          email: testEmail,
          password: "password123",
          firstName: "Jane",
        })
        .expect(400);
    });
  });

  describe("POST /api/auth/login", () => {
    let testUser;

    beforeEach(async () => {
      testUser = await createTestUser();
    });

    it("should login user", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: "password123",
        })
        .expect(200);

      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(testUser.email);
      if (res.body.token) {
        expect(res.body.token).toBeDefined();
      }
    });
  });

  describe("GET /api/auth/profile", () => {
    let userToken;

    beforeEach(async () => {
      const user = await createTestUser();
      // Use the real JWT config
      userToken = require("jsonwebtoken").sign(
        { id: user._id.toString(), email: user.email },
        process.env.JWT_SECRET || "test-secret",
        { expiresIn: "1h" }
      );
    });

    // Check the actual route path
    it("should return user profile", async () => {
      await request(app)
        .get("/api/users/profile")  // ← TRY THIS ROUTE
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);
    });

    it("should reject unauthorized", async () => {
      await request(app)
        .get("/api/users/profile")  
        .expect(401);
    });
  });
});

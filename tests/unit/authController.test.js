/* 
* for @rdashnox
*/

const {
  register,
  login,
  updateProfile,
} = require("../../controllers/auth.controller");
const { getProfile } = require("../../controllers/user.controller");
const User = require("../../models/User");
const { connectTestDB, clearDB, disconnectDB } = require("../testSetup");

jest.setTimeout(20000);

describe("Auth Controller Unit Tests", () => {
  beforeAll(async () => await connectTestDB());
  afterEach(async () => await clearDB());
  afterAll(async () => await disconnectDB());

  describe("register", () => {
    it("should register new user successfully", async () => {
      // TODO 1: Create req.body with valid user data (email, password, firstName, lastName)
      const req = {
        body: {
          email: "dash.nox@example.com",
          password: "password123",
          firstName: "Dash",
          lastName: "Nox",
        },
      };
      
      // TODO 2: Create mock res object with status() and json() methods
      const res = {
        status: jest.fn().mockReturnThis(), // Allows chaining .status().json()
        json: jest.fn(),
      };

      // TODO 3: Call the register function
      await register(req, res);

      // TODO 4: Assert status 201 and user email matches
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({
            email: "dash.nox@example.com",
          }),
        }),
      );
    });

    it("should reject duplicate email", async () => {
      // TODO 1: Create test email
      const testEmail = "duplicate@example.com";
      
      // TODO 2: Register first user (successful)
      const req1 = {
        body: {
          email: testEmail,
          password: "password123",
          firstName: "Dash",
          lastName: "Nox",
        },
      };
      const res1 = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await register(req1, res1);
      
      // TODO 3: Try registering same email again
      const req2 = {
        body: {
          email: testEmail,
          password: "anotherpassword", // Password doesn't matter for duplicate email check
          firstName: "Ralph",
          lastName: "Knox",
        },
      };
      const res2 = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await register(req2, res2);
      
      // TODO 4: Expect 400 status for duplicate
      expect(res2.status).toHaveBeenCalledWith(400);
      expect(res2.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "User exists", // Changed expected error message
        }),
      );
    });
  });

  describe("login", () => {
    let testUser;

    beforeEach(async () => {
      // HINT: Creates test user in DB before each test
      testUser = await User.create({
        email: `login${Date.now()}@example.com`,
        password: "password123",
        firstName: "Test",
      });
    });

    it("should login user with valid credentials", async () => {
      // TODO 1: Create req with testUser.email and correct password
      const req = {
        body: {
          email: testUser.email,
          password: "password123",
        },
      };
      
      // TODO 2: Mock res object
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      
      // TODO 3: Call login function
      await login(req, res);
      
      // TODO 4: Check successful response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          access: expect.any(String),
          user: expect.objectContaining({
            email: testUser.email,
          }),
        }),
      );
    });

    it("should reject invalid credentials", async () => {
      // TODO: Use testUser.email but WRONG password
      const req = {
        body: {
          email: testUser.email,
          password: "wrongpassword", // Wrong password
        },
      };
      
      // TODO: Mock res object
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      
      // TODO: Call login function
      await login(req, res);
      
      // TODO: Expect res.status(401)
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Invalid credentials", // Assuming this error message
        }),
      );
    });
  });

  describe("getProfile", () => {
    it("should return user profile", async () => {
      // TODO 1: Create test user
      const testUser = await User.create({
        email: "profile@example.com",
        password: "password123",
        firstName: "Dash",
        lastName: "Nox",
      });

      // TODO 2: req.user = { id: testUser._id }
      const req = {
        user: {
          id: testUser._id.toString(), // Needs to be string
          email: testUser.email,
          role: testUser.role,
        },
      };
      
      // TODO 3: Call getProfile and check res.json()
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: testUser._id.toString(), // Check that the returned profile ID matches
          email: testUser.email,
        }),
      );
    });
  });
});

/* 
* for @rdashnox
*/

const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../../controllers/auth.controller");
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
      const req = { /* YOUR CODE HERE */ };
      
      // TODO 2: Create mock res object with status() and json() methods
      const res = { /* YOUR CODE HERE */ };

      // TODO 3: Call the register function
      /* YOUR CODE HERE */

      // TODO 4: Assert status 201 and user email matches
      /* YOUR CODE HERE - expect(res.status).toHaveBeenCalledWith() */
      /* YOUR CODE HERE - check result.user.email */
    });

    it("should reject duplicate email", async () => {
      // TODO 1: Create test email
      const testEmail = /* YOUR CODE HERE */;
      
      // TODO 2: Register first user (successful)
      /* YOUR CODE HERE - call register() */
      
      // TODO 3: Try registering same email again
      /* YOUR CODE HERE */
      
      // TODO 4: Expect 400 status for duplicate
      /* YOUR CODE HERE */
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
      const req = { /* YOUR CODE HERE */ };
      
      // TODO 2: Mock res object
      const res = { /* YOUR CODE HERE */ };
      
      // TODO 3: Call login function
      /* YOUR CODE HERE */
      
      // TODO 4: Check successful response
      /* YOUR CODE HERE - expect(res.json).toHaveBeenCalled() */
    });

    it("should reject invalid credentials", async () => {
      // TODO: Use testUser.email but WRONG password
      // TODO: Expect res.status(401)
      /* YOUR CODE HERE */
    });
  });

  describe("getProfile", () => {
    it("should return user profile", async () => {
      // TODO 1: Create test user
      // TODO 2: req.user = { id: testUser._id }
      // TODO 3: Call getProfile and check res.json()
      /* YOUR CODE HERE */
    });
  });
});

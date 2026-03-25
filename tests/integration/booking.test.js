const request = require("supertest");
const app = require("../../app");
const {
  connectTestDB,
  clearDB,
  disconnectDB,
  createTestUser,
  createTestRoom,
  createAdminUser,
} = require("../testSetup");
const config = require("../../config/config");
const jwt = require("jsonwebtoken");

jest.setTimeout(20000);

describe("Booking API Integration Tests", () => {
  let user, admin, room, userToken, adminToken;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterEach(async () => {
    await clearDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    user = await createTestUser();
    admin = await createAdminUser();
    room = await createTestRoom();

    userToken = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: "1h" },
    );
    adminToken = jwt.sign(
      { id: admin._id.toString(), email: admin.email, role: admin.role },
      config.jwtSecret,
      { expiresIn: "1h" },
    );
  });

  describe("POST /api/booking - Create Booking", () => {
    it("should create booking successfully", async () => {
      const bookingData = {
        firstName: "John",
        lastName: "Doe",
        phone: "+639171234567",
        email: "john@example.com",
        checkInDate: "2026-04-15",
        checkOutDate: "2026-04-17",
        adults: 2,
        children: 0,
        boardType: "Breakfast",
        room: room._id.toString(),
        note: "Test booking",
      };

      const res = await request(app)
        .post("/api/booking")
        .set("Authorization", `Bearer ${userToken}`)
        .send(bookingData)
        .expect(201);

      expect(res.body.booking).toHaveProperty("id");
      expect(res.body.booking.firstName).toBe("John");
      expect(res.body.booking.totalCost).toBeGreaterThan(0);
      expect(res.body.booking.user).toBe(user._id.toString());
    });

    it("should reject invalid dates (past check-in)", async () => {
      const invalidData = {
        firstName: "John",
        lastName: "Doe",
        phone: "+639171234567",
        email: "john@example.com",
        checkInDate: "2020-01-01",
        checkOutDate: "2020-01-03",
        adults: 2,
        children: 0,
        boardType: "Breakfast",
        room: room._id.toString(),
      };

      const res = await request(app)
        .post("/api/booking")
        .set("Authorization", `Bearer ${userToken}`)
        .send(invalidData)
        .expect(400);

      expect(Array.isArray(res.body.message)).toBe(true);
      expect(res.body.message[0]).toContain("checkInDate");
    });

    it("should reject bookings without auth", async () => {
      const bookingData = {
        firstName: "John",
        lastName: "Doe",
        phone: "+639171234567",
        email: "john@example.com",
        checkInDate: "2026-04-15",
        checkOutDate: "2026-04-17",
        adults: 2,
        children: 0,
        boardType: "Breakfast",
        room: room._id.toString(),
      };

      await request(app).post("/api/booking").send(bookingData).expect(401);
    });

    it("should reject over-capacity bookings", async () => {
      const overCapacityData = {
        firstName: "John",
        lastName: "Doe",
        phone: "+639171234567",
        email: "john@example.com",
        checkInDate: "2026-04-15",
        checkOutDate: "2026-04-17",
        adults: 3, // Room maxGuests = 2
        children: 0,
        boardType: "Breakfast",
        room: room._id.toString(),
      };

      const res = await request(app)
        .post("/api/booking")
        .set("Authorization", `Bearer ${userToken}`)
        .send(overCapacityData)
        .expect(400);

      expect(typeof res.body.message).toBe("string");
      expect(res.body.message).toContain("exceeds room capacity");
    });
  });

  describe("GET /api/booking - Get My Bookings", () => {
    it("should return user's bookings", async () => {
      const bookingData = {
        firstName: "John",
        lastName: "Doe",
        phone: "+639171234567",
        email: "john@example.com",
        checkInDate: "2026-04-15",
        checkOutDate: "2026-04-17",
        adults: 2,
        children: 0,
        boardType: "Breakfast",
        room: room._id.toString(),
      };

      await request(app)
        .post("/api/booking")
        .set("Authorization", `Bearer ${userToken}`)
        .send(bookingData);

      const res = await request(app)
        .get("/api/booking/my")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].user).toBe(user._id.toString());
    });

    it("should return empty array for new user", async () => {
      const res = await request(app)
        .get("/api/booking/my")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(res.body).toEqual([]);
    });
  });

  describe("GET /api/booking - Admin Get All Bookings", () => {
    let bookingId;

    beforeEach(async () => {
      // Create booking first
      const res = await request(app)
        .post("/api/booking")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          firstName: "Test",
          lastName: "User",
          phone: "+639171234567",
          email: "test@example.com",
          checkInDate: "2026-04-15",
          checkOutDate: "2026-04-17",
          adults: 2,
          children: 0,
          boardType: "Breakfast",
          room: room._id.toString(),
        });
      bookingId = res.body.booking._id;
    });

    it("should allow admin to get all bookings", async () => {
      const res = await request(app)
        .get("/api/booking")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
    });

    it("should reject non-admin access", async () => {
      await request(app)
        .get("/api/booking")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe("PUT /api/booking/:id - Update Booking", () => {
    let bookingId;

    beforeEach(async () => {
      const res = await request(app)
        .post("/api/booking")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          firstName: "John",
          lastName: "Doe",
          phone: "+639171234567",
          email: "john@example.com",
          checkInDate: "2026-04-15",
          checkOutDate: "2026-04-17",
          adults: 2,
          children: 0,
          boardType: "Breakfast",
          room: room._id.toString(),
        });

      //bookingId = res.body.booking.id;
      bookingId = res.body.booking?._id || res.body.booking?.id;
    });

    it("should update booking successfully", async () => {
      const updateData = {
        phone: "+639999999999",
        boardType: "Half-board",
        adults: 1,
        children: 1,
      };

      const res = await request(app)
        .put(`/api/booking/${bookingId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(res.body.booking.phone).toBe("+639999999999");
      expect(res.body.booking.boardType).toBe("Half-board");
      expect(res.body.booking.totalCost).toBeGreaterThan(0);
    });

    it("should allow admin updates", async () => {
      const updateData = { phone: "+639888888888" };

      const res = await request(app)
        .put(`/api/booking/${bookingId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(res.body.booking.phone).toBe("+639888888888");
    });

    it("should reject invalid ObjectId", async () => {
      await request(app)
        .put("/api/booking/invalidId")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ phone: "123" })
        .expect(400);
    });

    it("should reject non-owner updates", async () => {
      const otherUser = await createTestUser({ email: "other@test.com" });
      const otherToken = jwt.sign(
        { id: otherUser._id.toString(), email: otherUser.email, role: "user" },
        config.jwtSecret,
      );

      const res = await request(app)
        .put(`/api/booking/${bookingId}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .send({ phone: "123" })
        .expect(400);

      expect(Array.isArray(res.body.message)).toBe(true);
    });
  });

  describe("DELETE /api/booking/:id - Cancel Booking", () => {
    let bookingId;

    beforeEach(async () => {
      const res = await request(app)
        .post("/api/booking")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          firstName: "John",
          lastName: "Doe",
          phone: "+639171234567",
          email: "john@jo.com",
          checkInDate: "2026-04-15",
          checkOutDate: "2026-04-17",
          adults: 2,
          children: 0,
          boardType: "Breakfast",
          room: room._id.toString(),
          note: "Test booking",
        });

      //bookingId = res.body.booking._id;
      bookingId =
        res.body.booking?._id ||
        res.body.booking?.id ||
        res.body._id ||
        res.body.id;
      //expect(bookingId).toBeDefined();
    });

    it("should cancel booking successfully", async () => {
      const res = await request(app)
        .delete(`/api/booking/${bookingId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.message).toBe("Booking cancelled successfully");
    });

    it("should reject non-existent booking", async () => {
      await request(app)
        .delete("/api/booking/507f1f77bcf86cd799439011")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(404);
    });

    it("should reject non-owner cancellation", async () => {
      const otherUser = await createTestUser({ email: "other@test.com" });
      const otherToken = jwt.sign(
        { id: otherUser._id.toString(), email: otherUser.email, role: "user" },
        config.jwtSecret,
      );

      await request(app)
        .delete(`/api/booking/${bookingId}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .expect(403);
    });
  });

  describe("Pagination", () => {
    beforeEach(async () => {
      const bookingData = {
        firstName: "John",
        lastName: "Doe",
        phone: "+639171234567",
        email: "john@example.com",
        checkInDate: "2026-04-15",
        checkOutDate: "2026-04-17",
        adults: 2,
        children: 0,
        boardType: "Breakfast",
        room: room._id.toString(),
      };

      await Promise.all([
        request(app)
          .post("/api/booking")
          .set("Authorization", `Bearer ${userToken}`)
          .send(bookingData),
        request(app)
          .post("/api/booking")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            ...bookingData,
            firstName: "Jane",
            email: "jane@example.com",
          }),
      ]);
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/booking/my?page=1&limit=1")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.page).toBe(1);
      expect(res.body.limit).toBe(1);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.total).toBe(2);
    });
  });
});

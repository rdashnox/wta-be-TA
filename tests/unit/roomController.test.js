/*
 * for @k358k
 */

const {
  getAllRooms,
  getRoomById,
  getRoomPricePreview,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../../controllers/room.controller");
const Room = require("../../models/Room");
const { connectTestDB, clearDB, disconnectDB } = require("../testSetup");

jest.setTimeout(20000);

describe("Room Controller Unit Tests", () => {
  beforeAll(async () => await connectTestDB());
  afterEach(async () => await clearDB());
  afterAll(async () => await disconnectDB());

  describe("getAllRooms (Public)", () => {
    it("should return all rooms from database", async () => {
      // TODO 1: Create 2 COMPLETE test rooms (ALL required fields!)
      /* YOUR CODE HERE:
      await Room.create([
        { type: "...", price: ..., maxGuests: ..., images: [...] },
        { type: "...", price: ..., maxGuests: ..., images: [...] }
      ]);
      */

      // TODO 2: Mock res.json()
      const req = {};
      const res = {
        /* YOUR CODE HERE */
      };

      // TODO 3: Call controller
      await /* YOUR CODE HERE */ (req, res);

      // TODO 4: Verify response
      const rooms = res.json.mock.calls[0][0];
      expect(Array.isArray(rooms)).toBe(true);
      expect(rooms.length).toBe(2);
    });
  });

  describe("getRoomById (Public)", () => {
    let testRoom;

    beforeEach(async () => {
      // HINT: Room model requires ALL these fields
      testRoom = await Room.create({
        /* TODO: Fill ALL required fields: type, price, maxGuests, images */
      });
    });

    it("should return room by valid ID", async () => {
      // TODO 1: req.params.id must be string (use .toString())
      const req = {
        /* YOUR CODE HERE */
      };
      const res = {
        /* YOUR CODE HERE */
      };

      await getRoomById(req, res);

      // TODO 2: Use objectContaining() - Mongoose transforms objects!
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          /* YOUR CODE HERE */
        }),
      );
    });

    it("should return 404 for invalid ID", async () => {
      const req = { params: { id: "invalid-id" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // TODO: Mock Room.findById to return null (not throw CastError!)
      /* YOUR CODE HERE - Room.findById = jest.fn().mockImplementation() */

      await getRoomById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Room not found" });
    });
  });

  describe("getRoomPricePreview (Public)", () => {
    let testRoom;

    beforeEach(async () => {
      testRoom = await Room.create({
        /* TODO: Complete room object */
      });
    });

    it("should return room + pricing data", async () => {
      // TODO 1: Setup ALL 5 required query params
      const req = {
        params: { id: testRoom._id.toString() },
        query: {
          /* TODO: checkInDate, checkOutDate, adults, children, boardType */
        },
      };
      const res = { json: jest.fn() };

      await getRoomPricePreview(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.room).toBeDefined();
      expect(result.pricing).toBeDefined();
    });

    it("should reject missing pricing params", async () => {
      // TODO: Empty query → expect status 400
      const req = {
        /* YOUR CODE HERE */
      };
      const res = {
        /* YOUR CODE HERE */
      };

      await getRoomPricePreview(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("createRoom (Admin only)", () => {
    it("should create new room successfully", async () => {
      // TODO: req.body with ALL required fields
      const req = {
        body: {
          /* YOUR CODE HERE: type, price, maxGuests, images */
        },
      };
      const res = {
        /* YOUR CODE HERE */
      };

      await createRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("Admin CRUD", () => {
    let testRoom;

    beforeEach(async () => {
      testRoom = await Room.create({
        /* TODO: ALL required fields */
      });
    });

    it("updateRoom should update existing room", async () => {
      const req = {
        params: { id: testRoom._id.toString() },
        body: {
          /* TODO: update data */
        },
      };
      const res = { json: jest.fn() };

      await updateRoom(req, res);
      expect(res.json).toHaveBeenCalled();
    });

    it("deleteRoom should delete successfully", async () => {
      const req = { params: { id: testRoom._id.toString() } };
      const res = { json: jest.fn() };

      await deleteRoom(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Room deleted successfully",
      });
    });
  });
});

/* ROOM CONTROLLER - CHALLENGE HINT
==========================

KEY CONCEPTS TO MASTER:
1. Room schema: type, price, maxGuests, images[] ← ALL REQUIRED!
2. Mongoose toJSON() transform → use expect.objectContaining()
3. CastError handling → mock findById to return null
4. Query params → 5 pricing params required
5. Express chaining → res.status().mockReturnThis().json()

🚨 COMMON FAILURES:
- Missing maxGuests → ValidationError
- testRoom._id → CastError (use .toString())
- expect(res.json).toHaveBeenCalledWith(testRoom) → Fails (use objectContaining)
- Invalid ID → 500 instead of 404 → Mock findById!

WORKING EXAMPLE:
Room.findById = jest.fn().mockImplementation((id) => {
  if (id === "invalid-id") return Promise.resolve(null);
  return Promise.resolve(testRoom);
});
 */

/*
 * for @k358k
 * DEVELOPER NOTE: Logic completed and verified. 
 * Mocked findById to return null for 'invalid-id' to ensure 404 response.
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
      await Room.create([
        { type: "Deluxe Suite", price: 5000, maxGuests: 2, images: ["img1.jpg"] },
        { type: "Standard Room", price: 2000, maxGuests: 1, images: ["img2.jpg"] }
      ]);

      // TODO 2: Mock res.json()
      const req = {};
      const res = {
        json: jest.fn(),
      };

      // TODO 3: Call controller
      await getAllRooms(req, res);

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
        type: "King Room",
        price: 3500,
        maxGuests: 2,
        images: ["king.jpg"]
      });
    });

    it("should return room by valid ID", async () => {
      // TODO 1: req.params.id must be string (use .toString())
      const req = {
        params: { id: testRoom._id.toString() }
      };
      const res = {
        json: jest.fn()
      };

      await getRoomById(req, res);

      // TODO 2: Use objectContaining() - Mongoose transforms objects!
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "King Room",
          price: 3500
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
      Room.findById = jest.fn().mockImplementation((id) => {
        if (id === "invalid-id") return Promise.resolve(null);
        return Promise.resolve(testRoom);
      });

      await getRoomById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Room not found" });
    });
  });

  describe("getRoomPricePreview (Public)", () => {
    let testRoom;

    beforeEach(async () => {
      testRoom = await Room.create({
        type: "Preview Room",
        price: 1500,
        maxGuests: 2,
        images: ["preview.jpg"]
      });
    });

    it("should return room + pricing data", async () => {
      // TODO 1: Setup ALL 5 required query params
      const req = {
        params: { id: testRoom._id.toString() },
        query: {
          checkInDate: "2026-05-01",
          checkOutDate: "2026-05-03",
          adults: "2",
          children: "1",
          boardType: "Breakfast"
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
        params: { id: testRoom._id.toString() },
        query: {} 
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
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
          type: "Executive Suite",
          price: 10000,
          maxGuests: 2,
          images: ["exec.jpg"]
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("Admin CRUD", () => {
    let testRoom;

    beforeEach(async () => {
      testRoom = await Room.create({
        type: "CRUD Test Room",
        price: 4000,
        maxGuests: 2,
        images: ["crud.jpg"]
      });
    });

    it("updateRoom should update existing room", async () => {
      const req = {
        params: { id: testRoom._id.toString() },
        body: {
          price: 4500 // TODO: update data
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
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

  describe("getAllRooms", () => {
    it("should return all rooms", async () => {
      await Room.create([
        { type: "Suite", price: 1000, maxGuests: 2 },
        { type: "Deluxe", price: 800, maxGuests: 3 },
      ]);

      const req = {};
      const res = { json: jest.fn() };

      await getAllRooms(req, res);

      expect(res.json).toHaveBeenCalled();
      const rooms = res.json.mock.calls[0][0];
      expect(Array.isArray(rooms)).toBe(true);
      expect(rooms.length).toBe(2);
    });
  });

  describe("getRoomById (Public)", () => {
    let testRoom;

    beforeEach(async () => {
      testRoom = await Room.create({
        type: "Suite",
        price: 1000,
        maxGuests: 2,
        images: [],
      });
    });

    it("should return room by valid ID", async () => {
      const req = { params: { id: testRoom._id.toString() } };
      const res = { json: jest.fn() };

      await getRoomById(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ type: "Suite" }),
      );
    });

    it("should return 404 for invalid ID", async () => {
      const req = { params: { id: "invalid-id" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock mongoose CastError handling
      Room.findById = jest.fn().mockImplementation((id) => {
        if (id === "invalid-id") {
          return Promise.resolve(null); // Simulate not found
        }
        return Promise.resolve(testRoom);
      });

      await getRoomById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Room not found" });
    });
  });

  describe("getRoomPricePreview", () => {
    let testRoom;

    beforeEach(async () => {
      testRoom = await Room.create({
        type: "Suite",
        price: 1000,
        maxGuests: 2,
      });
    });

    it("should return pricing preview", async () => {
      const req = {
        params: { id: testRoom._id.toString() },
        query: {
          checkInDate: "2026-05-01",
          checkOutDate: "2026-05-03",
          adults: "2",
          children: "0",
          boardType: "Breakfast",
        },
      };
      const res = { json: jest.fn() };

      await getRoomPricePreview(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.room).toBeDefined();
      expect(result.pricing).toBeDefined();
    });
  });

  describe("createRoom (Admin)", () => {
    it("should create new room", async () => {
      const req = {
        body: {
          type: "Penthouse",
          price: 2000,
          maxGuests: 4,
          images: ["img1.jpg"],
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await createRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("updateRoom (Admin)", () => {
    let testRoom;

    beforeEach(async () => {
      testRoom = await Room.create({
        type: "Suite",
        price: 1000,
        maxGuests: 2,
        images: [],
      });
    });

    it("should update room", async () => {
      const req = {
        params: { id: testRoom._id.toString() },
        body: { price: 1200 },
      };
      const res = { json: jest.fn() };

      await updateRoom(req, res);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("deleteRoom (Admin)", () => {
    let testRoom;

    beforeEach(async () => {
      testRoom = await Room.create({
        type: "Suite",
        price: 1000,
        maxGuests: 2,
        images: [],
      });
    });

    it("should delete room", async () => {
      const req = { params: { id: testRoom._id.toString() } };
      const res = { json: jest.fn() };

      await deleteRoom(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Room deleted successfully",
      });
    });
  });
});

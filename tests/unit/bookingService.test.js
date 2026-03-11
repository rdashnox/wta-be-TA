const { createBooking, updateBooking } = require("../../services/bookingService");
const Booking = require("../../models/Booking");
const Room = require("../../models/Room");
const User = require("../../models/User");
const { connectTestDB, clearDB, disconnectDB } = require("../testSetup");

// Increase default Jest timeout for slow in-memory DB startup
jest.setTimeout(20000);

describe("Booking Service", () => {
  let user, room;

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
    user = await User.create({
      email: "test@mail.com",
      password: "hashed",
      role: "user",
    });

    room = await Room.create({
      type: "Suite",
      price: 1000,
      maxGuests: 2,
    });
  });

  it("should create a valid booking", async () => {
    const bookingData = {
      firstName: "John",
      lastName: "Doe",
      phone: "+123456",
      email: "john@mail.com",
      checkInDate: "2026-05-01",
      checkOutDate: "2026-05-03",
      adults: 2,
      children: 0,
      boardType: "Breakfast",
      room: room._id,
    };

    const booking = await createBooking(bookingData, user._id);

    expect(booking).toHaveProperty("_id");
    expect(booking.totalCost).toBeGreaterThan(0);
    expect(booking.user.toString()).toBe(user._id.toString());
  });

  it("should throw error if room is over capacity", async () => {
    const overCapacityBooking = {
      firstName: "Jane",
      lastName: "Smith",
      phone: "+1234567",
      email: "jane@mail.com",
      checkInDate: "2026-05-01",
      checkOutDate: "2026-05-03",
      adults: 3, // exceeds room maxGuests=2
      children: 0,
      boardType: "Breakfast",
      room: room._id,
    };

    await expect(createBooking(overCapacityBooking, user._id)).rejects.toThrow(
      "Number of guests exceeds room capacity"
    );
  });

  it("should throw error if check-in is in the past", async () => {
    const pastBooking = {
      firstName: "Old",
      lastName: "Guest",
      phone: "+12345678",
      email: "old@mail.com",
      checkInDate: "2020-01-01",
      checkOutDate: "2026-05-03",
      adults: 1,
      children: 0,
      boardType: "Breakfast",
      room: room._id,
    };

    await expect(createBooking(pastBooking, user._id)).rejects.toThrow(
      "Check-in cannot be in the past"
    );
  });

  it("should throw error if check-out is before check-in", async () => {
    const invalidBooking = {
      firstName: "Alice",
      lastName: "Wonder",
      phone: "+12345679",
      email: "alice@mail.com",
      checkInDate: "2026-05-03",
      checkOutDate: "2026-05-01",
      adults: 1,
      children: 0,
      boardType: "Breakfast",
      room: room._id,
    };

    await expect(createBooking(invalidBooking, user._id)).rejects.toThrow(
      "Check-out must be after check-in"
    );
  });

  it("should prevent overlapping bookings for the same room", async () => {
    const firstBooking = {
      firstName: "John",
      lastName: "Doe",
      phone: "+123456",
      email: "john@mail.com",
      checkInDate: "2026-05-01",
      checkOutDate: "2026-05-03",
      adults: 2,
      children: 0,
      boardType: "Breakfast",
      room: room._id,
    };

    const secondBooking = {
      firstName: "Jane",
      lastName: "Smith",
      phone: "+1234567",
      email: "jane@mail.com",
      checkInDate: "2026-05-02", // overlaps
      checkOutDate: "2026-05-04",
      adults: 1,
      children: 0,
      boardType: "Breakfast",
      room: room._id,
    };

    await createBooking(firstBooking, user._id);

    await expect(createBooking(secondBooking, user._id)).rejects.toThrow(
      "Room already booked for these dates"
    );
  });
});
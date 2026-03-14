/* 
* for @rdashnox
*/

const { createBooking } = require("../../services/bookingService");
const Room = require("../../models/Room");
const User = require("../../models/User");
const { connectTestDB, clearDB, disconnectDB } = require("../testSetup");

jest.setTimeout(20000);

describe("Booking Service - HARD CHALLENGE", () => {
  let user, room;

  beforeAll(async () => await connectTestDB());
  afterEach(async () => await clearDB());
  afterAll(async () => await disconnectDB());

  beforeEach(async () => {
    // HINT: Creates test user + room before EVERY test
    user = await User.create({
      email: "test@example.com",
      password: "password123",
      role: "user",
    });
    room = await Room.create({
      type: "Standard",
      price: 100,
      maxGuests: 2,
    });
  });

  it("should create a valid booking", async () => {
    // TODO 1: Create bookingData with ALL fields
    const bookingData = {
      firstName: "Dash",
      lastName: "Nox",
      phone: "123-456-7890",
      email: "dash.nox@example.com",
      checkInDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
      checkOutDate: new Date(new Date().setDate(new Date().getDate() + 3)), // Day after tomorrow + 1
      adults: 1,
      children: 0,
      boardType: "Breakfast", // Added required boardType
      room: room._id, // Reference to the created room
    };

    // TODO 2: Call createBooking(bookingData, user._id)
    const booking = await createBooking(bookingData, user._id);

    // TODO 3: Verify booking created successfully
    expect(booking).toHaveProperty("_id");
    expect(booking.totalCost).toBeGreaterThan(0);
    expect(booking.user.toString()).toBe(user._id.toString());
  });

  it("should throw error if room is over capacity", async () => {
    // TODO: adults: 3 (room maxGuests=2) → expect specific error
    const overCapacityData = {
      firstName: "Dash",
      lastName: "Nox",
      phone: "123-456-7890",
      email: "dash.nox@example.com",
      checkInDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      checkOutDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      adults: 3, // Exceeds room.maxGuests which is 2
      children: 0,
      boardType: "Breakfast", // Added required boardType
      room: room._id,
    };

    await expect(createBooking(overCapacityData, user._id)).rejects.toThrow(
      "Number of guests exceeds room capacity", // Changed expected error message
    );
  });

  it("should throw error if check-in is in the past", async () => {
    // TODO: checkInDate: "2020-01-01" (past date)
    const pastCheckInBookingData = {
      firstName: "Dash",
      lastName: "Nox",
      phone: "123-456-7890",
      email: "dash.nox@example.com",
      checkInDate: new Date("2020-01-01"), // Past date
      checkOutDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      adults: 1,
      children: 0,
      boardType: "Breakfast", // Added required boardType
      room: room._id,
    };

    await expect(
      createBooking(pastCheckInBookingData, user._id),
    ).rejects.toThrow("Check-in cannot be in the past");
  });

  it("should throw error if check-out is before check-in", async () => {
    // TODO: checkOutDate < checkInDate
    const invalidDatesBookingData = {
      firstName: "Dash",
      lastName: "Nox",
      phone: "123-456-7890",
      email: "dash.nox@example.com",
      checkInDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      checkOutDate: new Date(new Date().setDate(new Date().getDate() + 1)), // checkOut before checkIn
      adults: 1,
      children: 0,
      boardType: "Breakfast", // Added required boardType
      room: room._id,
    };

    await expect(
      createBooking(invalidDatesBookingData, user._id),
    ).rejects.toThrow("Check-out must be after check-in");
  });

  it("should prevent overlapping bookings", async () => {
    // TODO 1: Create FIRST booking (May 1-3)
    const today = new Date();
    const checkInFirstBooking = new Date(today);
    checkInFirstBooking.setDate(today.getDate() + 1); // Tomorrow
    const checkOutFirstBooking = new Date(today);
    checkOutFirstBooking.setDate(today.getDate() + 3); // Day after tomorrow + 1

    const firstBookingData = {
      firstName: "Dash",
      lastName: "Nox",
      phone: "123-456-7890",
      email: "dash.nox@example.com",
      checkInDate: checkInFirstBooking,
      checkOutDate: checkOutFirstBooking,
      adults: 1,
      children: 0,
      boardType: "Breakfast", // Added required boardType
      room: room._id,
    };
    await createBooking(firstBookingData, user._id);

    // TODO 2: Try SECOND overlapping booking (May 2-4)
    const checkInOverlappingBooking = new Date(today);
    checkInOverlappingBooking.setDate(today.getDate() + 2); // Overlaps with first booking
    const checkOutOverlappingBooking = new Date(today);
    checkOutOverlappingBooking.setDate(today.getDate() + 4); // Also overlaps

    const overlappingBookingData = {
      firstName: "Ralph",
      lastName: "Knox",
      phone: "987-654-3210",
      email: "ralph.knox@example.com",
      checkInDate: checkInOverlappingBooking,
      checkOutDate: checkOutOverlappingBooking,
      adults: 1,
      children: 0,
      boardType: "Breakfast", // Added required boardType
      room: room._id,
    };

    // TODO 3: Expect overlap error
    await expect(createBooking(overlappingBookingData, user._id))
      .rejects.toThrow("Room already booked for these dates");
  });
});

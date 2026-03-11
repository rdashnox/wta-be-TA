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
    /* TODO 1: Create user with email, password, role */
    /* TODO 2: Create room with type, price, maxGuests (ALL required!) */
  });

  it("should create a valid booking", async () => {
    // TODO 1: Create bookingData with ALL fields
    const bookingData = {
      /* YOUR CODE HERE: firstName, lastName, phone, email, dates, guests, room */
    };

    // TODO 2: Call createBooking(bookingData, user._id)
    const booking = /* YOUR CODE HERE */;

    // TODO 3: Verify booking created successfully
    expect(booking).toHaveProperty("_id");
    expect(booking.totalCost).toBeGreaterThan(0);
    expect(booking.user.toString()).toBe(user._id.toString());
  });

  it("should throw error if room is over capacity", async () => {
    // TODO: adults: 3 (room maxGuests=2) → expect specific error
    const overCapacityData = {
      /* YOUR CODE HERE - adults > room.maxGuests */
    };

    /* YOUR CODE HERE - await expect(createBooking()).rejects.toThrow() */
  });

  it("should throw error if check-in is in the past", async () => {
    // TODO: checkInDate: "2020-01-01" (past date)
    /* YOUR CODE HERE - expect "Check-in cannot be in the past" */
  });

  it("should throw error if check-out is before check-in", async () => {
    // TODO: checkOutDate < checkInDate
    /* YOUR CODE HERE - expect "Check-out must be after check-in" */
  });

  it("should prevent overlapping bookings", async () => {
    // TODO 1: Create FIRST booking (May 1-3)
    const firstBooking = {
      /* YOUR CODE HERE - May 1 → May 3 */
    };
    await createBooking(firstBooking, user._id);

    // TODO 2: Try SECOND overlapping booking (May 2-4)
    const overlappingBooking = {
      /* YOUR CODE HERE - May 2 → May 4 (OVERLAPS!) */
    };

    // TODO 3: Expect overlap error
    await expect(createBooking(overlappingBooking, user._id))
      .rejects.toThrow("Room already booked for these dates");
  });
});

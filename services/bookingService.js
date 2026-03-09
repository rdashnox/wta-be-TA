const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const { calculatePricing } = require("./pricingService");

/**
 * Create booking with full validation + room availability check + PRICING + RACE CONDITION PROTECTION
 */
exports.createBooking = async (bookingData, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      checkInDate,
      checkOutDate,
      adults,
      children = 0,
      boardType,
      room,
      note,
    } = bookingData;

    // Required fields validation
    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !phone?.trim() ||
      !email?.trim() ||
      !room
    ) {
      throw new Error("Missing required fields: name, phone, email, room");
    }

    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    if (isNaN(startDate) || isNaN(endDate))
      throw new Error("Invalid date format");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) throw new Error("Check-in cannot be in the past");
    if (startDate >= endDate)
      throw new Error("Check-out must be after check-in");
    if (parseInt(adults) < 1) throw new Error("At least one adult required");

    // Fetch room document inside transaction
    const roomDoc = await Room.findById(room).session(session);
    if (!roomDoc) throw new Error("Room not found");

    // Check guest capacity
    const totalGuests = parseInt(adults) + parseInt(children);
    if (totalGuests > roomDoc.maxGuests) {
      throw new Error("Number of guests exceeds room capacity");
    }

    // Check for overlapping bookings to prevent race conditions
    const overlappingBooking = await Booking.findOne({
      room,
      $or: [
        { checkInDate: { $lt: endDate, $gte: startDate } },
        { checkOutDate: { $gt: startDate, $lte: endDate } },
        { checkInDate: { $lte: startDate }, checkOutDate: { $gte: endDate } },
      ],
    }).session(session);

    if (overlappingBooking) {
      throw new Error("Room already booked for these dates");
    }

    // Calculate pricing
    const pricing = calculatePricing(
      roomDoc.price,
      startDate,
      endDate,
      parseInt(adults),
      parseInt(children),
      boardType,
    );

    // Create booking inside transaction
    const booking = await Booking.create(
      [
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          checkInDate: startDate,
          checkOutDate: endDate,
          adults: parseInt(adults),
          children: parseInt(children),
          boardType,
          note: note?.trim() || "",
          room,
          user: userId,
          nights: pricing.nights,
          roomPrice: pricing.roomPrice,
          totalCost: pricing.totalCost,
          pricingBreakdown: pricing.breakdown,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return await booking[0].populate("room");
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

/**
 * Get all bookings for authenticated user
 */
exports.getUserBookings = async (userId) => {
  return await Booking.find({ user: userId })
    .populate("room")
    .sort({ createdAt: -1 });
};

/**
 * Update booking (dates, guests, board type only) + RECALCULATE PRICING
 */
exports.updateBooking = async (bookingId, updateData) => {
  const booking = await Booking.findById(bookingId).populate("room");
  if (!booking) throw new Error("Booking not found");

  if (new Date(booking.checkInDate) < new Date()) {
    throw new Error("Cannot update past bookings");
  }

  const updates = {};

  // Apply simple fields
  if (updateData.phone) updates.phone = updateData.phone.trim();
  if (updateData.email) updates.email = updateData.email.trim().toLowerCase();
  if (updateData.note !== undefined) updates.note = updateData.note.trim();
  if (updateData.adults !== undefined)
    updates.adults = parseInt(updateData.adults);
  if (updateData.children !== undefined)
    updates.children = parseInt(updateData.children);
  if (updateData.boardType) updates.boardType = updateData.boardType;

  // CheckOutDate
  if (updateData.checkOutDate) {
    const newEndDate = new Date(updateData.checkOutDate);
    if (newEndDate <= booking.checkInDate)
      throw new Error("Check-out must be after check-in");

    // Room capacity validation
    const totalGuests =
      (updateData.adults ?? booking.adults) +
      (updateData.children ?? booking.children);
    if (totalGuests > booking.room.maxGuests)
      throw new Error("Number of guests exceeds room capacity");

    updates.checkOutDate = newEndDate;
  }

  // Recalculate pricing if needed
  if (
    updates.checkOutDate ||
    updates.adults !== undefined ||
    updates.children !== undefined ||
    updates.boardType
  ) {
    const pricing = calculatePricing(
      booking.room.price,
      booking.checkInDate,
      updates.checkOutDate || booking.checkOutDate,
      updates.adults ?? booking.adults,
      updates.children ?? booking.children,
      updates.boardType ?? booking.boardType,
    );

    updates.nights = pricing.nights;
    updates.totalCost = pricing.totalCost;
    updates.pricingBreakdown = pricing.breakdown;
    updates.roomPrice = booking.room.price;
  }

  const updated = await Booking.findByIdAndUpdate(bookingId, updates, {
    new: true,
  }).populate("room");

  return updated;
};

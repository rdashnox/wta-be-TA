const Booking = require("../models/Booking");
const Room = require("../models/Room");
const { calculatePricing } = require("./pricingService");

/**
 * Create booking with full validation + room availability check + PRICING
 */
exports.createBooking = async (bookingData, userId) => {
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

  // Required fields check
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

  // Date validation
  if (isNaN(startDate) || isNaN(endDate))
    throw new Error("Invalid date format");
  if (startDate < new Date()) throw new Error("Check-in cannot be in past");
  if (startDate >= endDate) throw new Error("Check-out must be after check-in");
  if (parseInt(adults) < 1) throw new Error("At least one adult required");

  //  FETCH ROOM PRICE SNAPSHOT
  const roomDoc = await Room.findById(room);
  if (!roomDoc) throw new Error("Room not found");

  // CALCULATE PRICING (Palawan luxury rates)
  const pricing = calculatePricing(
    roomDoc.price, 
    checkInDate, 
    checkOutDate, 
    parseInt(adults),
    parseInt(children), 
    boardType, 
  );

  // ROOM AVAILABILITY CHECK
  const overlapping = await Booking.findOne({
    room,
    $or: [{ checkInDate: { $lt: endDate }, checkOutDate: { $gt: startDate } }],
  });

  if (overlapping) throw new Error("Room unavailable for selected dates");

  // CREATE BOOKING WITH FULL PRICING + NOTE
  const booking = await Booking.create({
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

    // COMPLETE PRICING DATA
    nights: pricing.nights,
    roomPrice: pricing.roomPrice,
    totalCost: pricing.totalCost,
    pricingBreakdown: pricing.breakdown,
  });

  return await booking.populate("room");
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
exports.updateBooking = async (bookingId, updateData, userId) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    user: userId,
  }).populate("room");

  if (!booking) throw new Error("Booking not found");

  // Prevent past check-in updates
  if (new Date(booking.checkInDate) < new Date()) {
    throw new Error("Cannot update past bookings");
  }

  // Allow only safe fields
  const allowedUpdates = [
    "checkOutDate",
    "adults",
    "children",
    "boardType",
    "note",
  ];
  const updates = {};

  for (const [key, value] of Object.entries(updateData)) {
    if (allowedUpdates.includes(key)) {
      updates[key] = value;
    }
  }

  // RECALCULATE PRICING if dates/guests/board changed
  if (
    updates.checkOutDate ||
    updates.adults ||
    updates.children ||
    updates.boardType
  ) {
    const pricing = calculatePricing(
      booking.room.price,
      booking.checkInDate,
      updates.checkOutDate || booking.checkOutDate,
      updates.adults || booking.adults,
      updates.children !== undefined
        ? parseInt(updates.children)
        : booking.children,
      updates.boardType || booking.boardType,
    );

    updates.nights = pricing.nights;
    updates.totalCost = pricing.totalCost;
    updates.pricingBreakdown = pricing.breakdown;
    updates.roomPrice = booking.room.price; 
  }

  // Validate new dates if changed
  if (updates.checkOutDate) {
    const newEndDate = new Date(updates.checkOutDate);
    if (newEndDate <= booking.checkInDate) {
      throw new Error("Check-out must be after check-in");
    }

    const overlapping = await Booking.findOne({
      room: booking.room._id,
      _id: { $ne: bookingId },
      $or: [
        {
          checkInDate: { $lt: newEndDate },
          checkOutDate: { $gt: booking.checkInDate },
        },
      ],
    });

    if (overlapping) throw new Error("Room unavailable for new dates");
  }

  await Booking.findByIdAndUpdate(bookingId, updates);
  return await Booking.findById(bookingId).populate("room");
};

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // Guest information
    firstName: { type: String, required: [true, "First name required"] },
    lastName: { type: String, required: [true, "Last name required"] },
    phone: { type: String, required: [true, "Phone required"] },
    email: {
      type: String,
      required: [true, "Email required"],
      lowercase: true,
      trim: true,
    },

    // Stay details
    checkInDate: { type: Date, required: [true, "Check-in date required"] },
    checkOutDate: { type: Date, required: [true, "Check-out date required"] },
    adults: { type: Number, required: [true, "Adults required"], min: 1 },
    children: { type: Number, default: 0, min: 0 },

    boardType: {
      type: String,
      enum: ["Breakfast", "Half-board"],
      required: [true, "Board type required"],
    },
    note: {
      type: String,
      maxlength: [500, "Note too long"],
      trim: true,
    },

    // References
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // PRICING FIELDS
    nights: { type: Number, required: true, min: 1 },
    roomPrice: { type: Number, required: true }, // Snapshot of Room.price at booking
    totalCost: { type: Number, required: true },
    pricingBreakdown: {
      baseRoom: { type: Number, required: true },
      extraAdults: { type: Number, default: 0 },
      children: { type: Number, default: 0 },
      meals: { type: Number, required: true },
    },
  },
  { timestamps: true },
);

// Clean JSON for frontend (hides MongoDB internals)
bookingSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Booking", bookingSchema);

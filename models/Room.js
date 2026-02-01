const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    images: [{ type: String }],
    available: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Transform _id → id for frontend consistency
roomSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Room", roomSchema);

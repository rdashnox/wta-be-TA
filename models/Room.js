const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true, min: 1 },
    images: [{ type: String }],
  },
  { timestamps: true },
);

// Transform _id → id for frontend
roomSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Room", roomSchema);

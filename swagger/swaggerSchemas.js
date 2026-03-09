// swagger/swaggerSchemas.js
const m2s = require("mongoose-to-swagger");

// Import all models
const Booking = require("../models/Booking");
const User = require("../models/User");
const Room = require("../models/Room");
const Contact = require("../models/Contact");
const Subscription = require("../models/Subscription");

// Generate Swagger/OpenAPI schemas dynamically from Mongoose models
const schemas = {
  Booking: m2s(Booking, { required: true }),
  User: m2s(User, { required: true }),
  Room: m2s(Room, { required: true }),
  Contact: m2s(Contact, { required: true }),
  Subscription: m2s(Subscription, { required: true }),
};

module.exports = schemas;
const Joi = require("joi");
const { Types } = require("mongoose");

// ----------------- Custom Validators -----------------

// Validate MongoDB ObjectId
const objectId = (value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid"); // Returns a Joi error if not a valid ObjectId
  }
  return value; // Returns if valid
};

// Validator for checkInDate to be today or future
const checkInDateTodayOrFuture = (value, helpers) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (new Date(value) < today) {
    return helpers.message("checkInDate must be today or a future date");
  }
  return value;
};

// Validator for checkOutDate at least 1 day after checkInDate
const checkOutDateMinimumOneNight = (value, helpers) => {
  const checkInDate = new Date(helpers.state.ancestors[0].checkInDate);
  const checkOutDate = new Date(value);

  const diffTime = checkOutDate.getTime() - checkInDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays < 1) {
    return helpers.message(
      "checkOutDate must be at least one day after checkInDate",
    );
  }
  return value;
};

// ----------------- Joi Schemas -----------------

// Create Booking Schema
const createBookingSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).required(),
  lastName: Joi.string().min(1).max(50).required(),
  phone: Joi.string().min(10).max(20).required(),
  email: Joi.string().email().lowercase().required(),
  checkInDate: Joi.date()
    .iso()
    .required()
    .custom(checkInDateTodayOrFuture, "checkInDate today or future validation"),
  checkOutDate: Joi.date()
    .iso()
    .required()
    .greater(Joi.ref("checkInDate"))
    .custom(
      checkOutDateMinimumOneNight,
      "checkOutDate minimum one night validation",
    ),
  adults: Joi.number().integer().min(1).max(4).required(),
  children: Joi.number().integer().min(0).max(6).default(0),
  boardType: Joi.string().valid("Breakfast", "Half-board").required(),
  room: Joi.string().custom(objectId, "MongoDB ObjectId").required(),
  note: Joi.string().max(500).allow(""),
});

// Update Booking Schema
const updateBookingSchema = Joi.object({
  phone: Joi.string().min(10).max(20),
  email: Joi.string().email().lowercase(),
  checkOutDate: Joi.date()
    .iso()
    .custom((value, helpers) => {
      const checkInDate =
        helpers.state.ancestors[0].checkInDate ||
        helpers.state.ancestors[0]._existingCheckInDate;
      if (!checkInDate) {
        return helpers.message(
          "Cannot validate checkOutDate without checkInDate",
        );
      }

      if (new Date(value) <= new Date(checkInDate)) {
        return helpers.message(
          "checkOutDate must be at least one day after checkInDate",
        );
      }
      return value;
    }),

  adults: Joi.number().integer().min(1).max(4),
  children: Joi.number().integer().min(0).max(6),
  boardType: Joi.string().valid("Breakfast", "Half-board"),
  note: Joi.string().max(500).allow(""),
}).min(1);

// ----------------- Middleware Factory -----------------

// General purpose validator for req.body
const validate = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true, // remove unknown keys
  });

  if (error) {
    const messages = error.details.map((err) => err.message);
    return res.status(400).json({ message: messages });
  }

  req.body = value; 
  next();
};

// Middleware for validating URL param :id as ObjectId
const validateParamId =
  (paramName = "id") =>
  (req, res, next) => {
    if (!Types.ObjectId.isValid(req.params[paramName])) {
      return res.status(400).json({ message: `Invalid ${paramName} ObjectId` });
    }
    next();
  };

// Validates room type, pricing, and guest capacity
const roomSchema = Joi.object({
  type: Joi.string().required(),
  price: Joi.number().min(0).required(),
  maxGuests: Joi.number().integer().min(1).required(),
  images: Joi.array().items(Joi.string())
});

// Validates user inquiry details and contact email
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().lowercase().required(),
  subject: Joi.string().allow(""),
  message: Joi.string().min(5).required()
});

// Validates new user email and password
const registerSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required()
});

// Validates login credentials for existing users
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const subscriptionSchema = Joi.object({
  email: Joi.string().email().lowercase().required()
});


module.exports = {
  validateBookingCreate: validate(createBookingSchema),
  validateBookingUpdate: validate(updateBookingSchema),
  validateParamId,

// Krizia's Validators
  validateRoom: validate(roomSchema),
  validateContact: validate(contactSchema),
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
  validateSubscription: validate(subscriptionSchema)
};
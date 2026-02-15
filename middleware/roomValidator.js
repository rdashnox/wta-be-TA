const Joi = require('joi');

// Define what a valid "Room" looks like
const roomSchema = Joi.object({
  type: Joi.string().required(),
  price: Joi.number().min(0).required(),
  maxGuests: Joi.number().integer().min(1).required(),
  images: Joi.array().items(Joi.string()).optional()
});

// The actual function that the route calls
exports.validateRoom = (req, res, next) => {
  const { error } = roomSchema.validate(req.body);
  if (error) {
    // This sends the 400 error back to Postman
    return res.status(400).json({ message: error.details[0].message });
  }
  next(); // If data is good, go to the controller
};
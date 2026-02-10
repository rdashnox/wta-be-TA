const Joi = require ('joi')
const { Types } = require('mongoose');

const objectId = (value, helpers) => {
    if (!Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid'); // Returns a Joi error if not a valid ObjectId
    }
    return value; // Returns if valid
};

// Custom validtor for checkInDate to be today or in the future (strictly not in the past)
const checkInDateTodayOrFuture = (value, helpers) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight to compare dates only

    if (new Date(value) < today) {
        return helpers.message ('checkInDate must be today or a future date');
    }
    return value;
};

// Custom validator for checkOutDate to be at least one day after checkInDate (minimum one night stay)
const checkOutDateMinimumOneNight = (value, helpers) => {
    // Check with checkInDate from the booking data being validated
    const checkInDate = new Date(helpers.state.ancestors[0].checkInDate);
    const checkOutDate = new Date(value);

    // Calculate the difference in days between checkInDate and checkOutDate
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
        return helpers.message('checkOutDate must be at least one day after checkInDate');
    }
    return value;
};

// --Joi Schemas --

// Defining schema for creating a new booking (all fields required)
const createBookingSchema = Joi.object({
    firstName: Joi.string().min(1).max(50).required(),
    lastName: Joi.string().min(1).max(50).required(),
    phone: Joi.string().min(10).max(20).required(),
    email: Joi.string().email().lowercase().required(),
    checkInDate: Joi.date().iso().required().custom(checkInDateTodayOrFuture, 'checkInDate today or future validation'),
    // checkOutDate needs to be greater than checkInDate AND pass the custom one-night minimum validation
    checkOutDate: Joi.date().iso().required()
    .greater(Joi.ref('checkInDate')) // Ensures checkOutDate is strictly after checkInDate
   .custom(checkOutDateMinimumOneNight, 'checkOutDate minimum one night validation'),
   adults: Joi.number().integer().min(1).max(4).required(),
   children: Joi.number().integer().min(0).max(6).default(0), // default(0) if not provided/selected
   boardType: Joi.string().valid('Breakfast', 'Half-board').required(),
   room: Joi.string().custom(objectId, 'MongoDB ObjectId').required(), // Uses our custom objectId validator
   note: Joi.string().max(500).allow('') // Allow empty string for note
});

// Schema for updating an existing booking (all fields optional but at least one is required)
const updateBookingSchema = Joi.object({
    firstName: Joi.string().min(1).max(50), 
    lastName: Joi.string().min(1).max(50),   
    phone: Joi.string().min(10).max(20),     
    email: Joi.string().email().lowercase(), 
    checkInDate: Joi.date().iso().custom(checkInDateTodayOrFuture, 'checkInDate today or future validation'), 
    checkOutDate: Joi.date().iso()
        .greater(Joi.ref('checkInDate')) // Still needs to be greater than checkInDate
        .custom(checkOutDateMinimumOneNight, 'checkOutDate minimum one night validation'), 
   adults: Joi.number().integer().min(1).max(4), 
   children: Joi.number().integer().min(0).max(6), // No default needed for update
   boardType: Joi.string().valid('Breakfast', 'Half-board'), 
   room: Joi.string().custom(objectId, 'MongoDB ObjectId'), 
   note: Joi.string().max(500).allow('') 
}).min(1); //Ensures at least one field is provided for an upodate

// -- General Validation Middleware Factory -- 

// This function will take the Joi schema and returns an Express middleware function
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false}); // This validates and collects all errors

    if (error) {
        const detailedMessage = error.details.map(err => err.message); // Extract and join error messages
        return res.status(400).json({ message: detailedMessage }) // Sends error response (400)
    }
    next(); // If the validation passes, continue to the next middleware/controller    
};

// -- Exportable Validation Middleware --

// Middleware to validate data when creating a new booking
const validateBookingCreate = validate(createBookingSchema);

// Middleware to validate data when updating an existing booking
const validateBookingUpdate = validate(updateBookingSchema);

module.exports = {
    validateBookingCreate,
    validateBookingUpdate
};



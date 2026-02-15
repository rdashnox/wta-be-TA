const Joi = require('joi');

// Schema for newsletter/plan subscriptions
const subscriptionSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  plan: Joi.string().valid('basic', 'premium', 'pro').optional()
});

exports.validateSubscription = (req, res, next) => {
  const { error } = subscriptionSchema.validate(req.body);
  if (error) {
    // This sends the 400 error Arnel wants to see
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
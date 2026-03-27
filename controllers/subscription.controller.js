const Subscription = require("../models/Subscription");
const { verifyEmail } = require("../utils/emailVerifier");
const logger = require("../utils/logger");

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    await verifyEmail(email);

    const existing = await Subscription.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already subscribed." });
    }

    const newSubscription = new Subscription({ email, status: "active" });
    await newSubscription.save();

    res.status(201).json(newSubscription);
  } catch (error) {
    logger.error(
      `Subscription error: ${error.message}`,
      error.response?.data || error.response?.status,
    );
    res.status(400).json({ message: error.message });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;
    await verifyEmail(email);

    const subscription = await Subscription.findOneAndUpdate(
      { email },
      { status: "unsubscribed" },
      { new: true },
    );

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json(subscription);
  } catch (error) {
    logger.error(
      `Unsubscribe error: ${error.message}`,
      error.response?.data || error.response?.status,
    );
    res.status(400).json({ message: error.message });
  }
};

exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json(subscriptions);
  } catch (error) {
    logger.error(`Get subscriptions error: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch subscriptions" });
  }
};

exports.sendNewsletter = async (req, res) => {
  try {
    const recipients = await Subscription.find({ status: "active" });
    logger.info(`Sending newsletter to ${recipients.length} recipients.`);

    res.status(200).json({
      message: "Newsletter simulation successful",
      recipientCount: recipients.length,
    });
  } catch (error) {
    logger.error(`Newsletter error: ${error.message}`);
    res.status(500).json({ message: "Failed to send newsletter" });
  }
};

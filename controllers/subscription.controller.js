const Subscription = require("../models/Subscription");

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await Subscription.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email is already subscribed" });
    }

    const newSubscription = new Subscription({ email, status: "active" });
    await newSubscription.save();

    res.status(201).json(newSubscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

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
    res.status(400).json({ message: error.message });
  }
};

exports.getAllSubscriptions = async (req, res) => {
  try {
    // TODO: fetch
    const subscriptions = await Subscription.find();
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.sendNewsletter = async (req, res) => {
  try {
    // Only send to active subscribers
    const recipients = await Subscription.find({ status: "active" });

    console.log(`Sending newsletter to ${recipients.length} recipients.`);

    res.status(200).json({
      message: "Newsletter simulation successful",
      recipientCount: recipients.length,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

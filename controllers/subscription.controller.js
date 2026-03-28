const Subscription = require("../models/Subscription");
const { verifyEmail } = require("../utils/emailVerifier");
const { sendMail } = require("../services/emailService");
const logger = require("../utils/logger");

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    await verifyEmail(email);

    let subscription = await Subscription.findOne({ email });
    let action = null;

    // Already active (no change)
    if (subscription && subscription.status === "active") {
      return res.status(400).json({
        message: "Email already subscribed.",
      });
    }

    // Resubscribe
    if (subscription && subscription.status === "unsubscribed") {
      subscription.status = "active";
      await subscription.save();
      action = "resubscribed";
    }

    // New subscription
    if (!subscription) {
      subscription = new Subscription({
        email,
        status: "active",
      });
      await subscription.save();
      action = "created";
    }

    if (action) {
      try {
        await sendMail({
          to: email,
          subject:
            action === "created" ? "Subscription Confirmed" : "Welcome Back!",
          html: `
          <div style="font-family: system-ui, sans-serif, Arial; font-size: 16px;"><a style="text-decoration: none; outline: none;" href="https://wta-fe.weba.app" target="_blank" rel="noopener"> 
          <img style="height: 32px; vertical-align: middle;" src="https://res.cloudinary.com/desbl1wni/image/upload/v1/collection/mwjh03unylyozix3ibvm?_a=BAMAOGM50" alt="logo" height="32px"> </a> <p style="padding-top: 16px; border-top: 1px solid #eaeaea;">Hi ${email},</p> 
          <p>Thanks for subscribing! Your email has been successfully added to our newsletter list.<br>Stay tuned for updates.</p> <p style="padding-top: 16px; border-top: 1px solid #eaeaea;">Best regards,<br>Sky Suites Hotel CRM Team</p> 
          </div>
          `,
        });
      } catch (emailError) {
        logger.warn(`Email failed: ${emailError.message}`);
      }
    }

    return res.status(201).json(subscription);
  } catch (error) {
    logger.error(`Subscription error: ${error.message}`);
    return res.status(400).json({
      message: error.message || "Subscription failed",
    });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    await verifyEmail(email);

    const subscription = await Subscription.findOne({ email });

    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    if (subscription.status === "unsubscribed") {
      return res.status(400).json({
        message: "Already unsubscribed",
      });
    }

    subscription.status = "unsubscribed";
    await subscription.save();

    try {
      await sendMail({
        to: email,
        subject: "Unsubscribed",
        html: `
       <div style="font-family: system-ui, sans-serif, Arial; font-size: 16px"> <a style="text-decoration: none; outline: none" href="https://wta-fe.web.app" target="_blank"> 
       <img style="height: 32px; vertical-align: middle" height="32px" src="https://res.cloudinary.com/desbl1wni/image/upload/v1/collection/mwjh03unylyozix3ibvm?_a=BAMAOGM50" alt="logo" /> </a> 
       <p style="padding-top: 16px; border-top: 1px solid #eaeaea">Hi ${email},</p> <p> You’ve been successfully unsubscribed from our newsletter.<br />We’re sorry to see you go. </p> 
       <p style="padding-top: 16px; border-top: 1px solid #eaeaea"> Best regards,<br />Sky Suites Hotel CRM Team </p> 
       </div>
        `,
      });
    } catch (emailError) {
      logger.warn(`Unsubscribe email failed: ${emailError.message}`);
    }

    return res.status(200).json(subscription);
  } catch (error) {
    logger.error(`Unsubscribe error: ${error.message}`);
    return res.status(400).json({
      message: error.message || "Unsubscribe failed",
    });
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

require("dotenv").config();
const config = require("./config/config");
const createError = require("http-errors");
const express = require("express");
const passport = require("./config/passport");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const logger = require("./utils/logger");
const connectDB = require("./config/db");


const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const roomRouter = require("./routes/room");
const contactRouter = require("./routes/contact");
const subscriptionRouter = require("./routes/subscription");
const bookingRouter = require("./routes/booking");

const app = express();

// Connect to database
connectDB();
 
app.use(helmet({ contentSecurityPolicy: false }));
app.use(mongoSanitize());
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()), 
    },
  })
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/contact", contactRouter);
app.use("/api/subscription", subscriptionRouter);
app.use("/api/booking", bookingRouter);


// 404 handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  logger.error("Server Error:", err);
  res.status(err.status || 500).json({
    message:
      process.env.NODE_ENV === "production" ? "Server error" : err.message,
  });
});

module.exports = app;

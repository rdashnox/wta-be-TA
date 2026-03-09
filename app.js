require("dotenv").config();
const config = require("./config/config");
const createError = require("http-errors");
const express = require("express");
const passport = require("./config/passport");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const logger = require("./utils/logger");
const connectDB = require("./config/db");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean"); // Extra XSS protection
const { JSDOM } = require("jsdom");
const createDOMPurify = require("dompurify");
const { swaggerSpec, swaggerUi } = require("./swagger/swagger");

// Initialize DOMPurify
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

// Routers
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const roomRouter = require("./routes/room");
const contactRouter = require("./routes/contact");
const subscriptionRouter = require("./routes/subscription");
const bookingRouter = require("./routes/booking");

const app = express();

// Connect to database
connectDB();

// Set security headers
helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "https://cdn.jsdelivr.net",
      "https://kit.fontawesome.com",
    ],
    styleSrc: ["'self'", "https://cdn.jsdelivr.net"],
    imgSrc: ["'self'", "data:"],
    connectSrc: ["'self'", config.frontendUrl],
    fontSrc: [
      "'self'",
      "https://cdn.jsdelivr.net",
      "https://kit.fontawesome.com",
    ],
    objectSrc: ["'none'"],
    frameAncestors: ["'none'"],
    upgradeInsecureRequests: [],
  },
});

// Prevent NoSQL injection
app.use(mongoSanitize());

// Prevent XSS (basic)
app.use(xss());

// Enable CORS with credentials
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  }),
);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Compress responses
app.use(compression());

// Limit requests per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Body parser with size limit
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser(process.env.COOKIE_SECRET || "defaultSecret"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Passport init
app.use(passport.initialize());

// Logging
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

// SANITIZE INPUT MIDDLEWARE
app.use((req, res, next) => {
  if (req.body && req.body.note) {
    req.body.note = DOMPurify.sanitize(req.body.note);
  }
  next();
});

// ROUTES
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/contact", contactRouter);
app.use("/api/subscription", subscriptionRouter);
app.use("/api/booking", bookingRouter);

// 404 HANDLER
app.use((req, res, next) => {
  next(createError(404));
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  logger.error("Server Error:", err);
  res.status(err.status || 500).json({
    message:
      process.env.NODE_ENV === "production" ? "Server error" : err.message,
  });
});

module.exports = app;


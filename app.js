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
const xss = require("xss-clean");
const { swaggerSpec, swaggerUi } = require("./swagger/swagger");

const allowedOrigins = config.frontendUrls;

// Initialize DOMPurify
let DOMPurify;
if (!config.isTest) {
  const { JSDOM } = require("jsdom");
  const createDOMPurify = require("dompurify");
  const window = new JSDOM("").window;
  DOMPurify = createDOMPurify(window);
}

// Routers
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const roomRouter = require("./routes/room");
const contactRouter = require("./routes/contact");
const subscriptionRouter = require("./routes/subscription");
const bookingRouter = require("./routes/booking");
const uploadRouter = require("./routes/upload");
const healthRouter = require("./routes/health");

const app = express();

// health check endpoint
app.use("/health", healthRouter);

app.set("trust proxy", 1);

// Connect to database
if (!config.isTest) {
  connectDB();
}

// Body parser with size limit
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

// Prevent NoSQL injection
app.use(mongoSanitize());
// Prevent XSS (basic)
app.use(xss());

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
    connectSrc: ["'self'", ...config.frontendUrls],
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

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps / curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS: " + origin));
      }
    },
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
  if (req.body?.note && DOMPurify) {
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
app.use("/api/upload", uploadRouter);

// 404 HANDLER
app.use((req, res, next) => {
  logger.error(`404 Attempted path: ${req.method} ${req.originalUrl}`);
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

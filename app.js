const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const authRouter = require("./routes/authRoutes");
const regRouter = require("./routes/regRoutes");

const app = express();

// MIDDLEWARE
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.options("*", cors());

const limiter = rateLimit({
  max: process.env.MAX_LIMIT,
  windowMs: 60 * 1000,
  message: "too many request please try again in few minutes"
});

app.use(limiter);
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());
app.use(xss());

// ROUTES
app.use("/api/v1/users", authRouter);
app.use("/api/v1/reg", regRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't found ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

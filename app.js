const express = require("express");
const morgan = require("morgan");
var cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const regRouter = require("./routes/regRoutes");

const app = express();

// MIDDLEWARE
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/v1/reg", regRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't found ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

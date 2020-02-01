const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.createUser = catchAsync(async (req, res, next) => {
  console.log("hello");
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role || "user"
  });

  newUser.password = undefined;

  res.status(201).json({
    status: "success",
    data: {
      user: newUser
    }
  });
});

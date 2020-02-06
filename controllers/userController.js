const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.createUser = catchAsync(async (req, res, next) => {
  let role = "user";
  if (req.user.role == "admin") {
    role = "core-team";
  } else if (req.user.role == "core-team") {
    role = "management";
  }

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: role,
    createdBy: req.user
  });

  newUser.password = undefined;
  res.status(201).json({
    status: "success",
    data: {
      user: newUser.depopulate("createdBy")
    }
  });
});

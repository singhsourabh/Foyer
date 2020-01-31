const Registration = require("./../models/regModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const restrict = require("./../utils/restrict");

exports.getAllReg = (req, res, next) => {
  res.status(200).json({
    status: "Not implemented"
  });
};

exports.createReg = catchAsync(async (req, res, next) => {
  const data = restrict(req.body);

  const doc = await Registration.create(data);
  res.status(200).json({
    status: "success",
    data: {
      data: doc
    }
  });
});

exports.getReg = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(AppError("No tour found with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: { tour }
  });
});

exports.updateReg = (req, res, next) => {
  res.status(200).json({
    status: "Not implemented"
  });
};

exports.delReg = (req, res, next) => {
  res.status(200).json({
    status: "Not implemented"
  });
};

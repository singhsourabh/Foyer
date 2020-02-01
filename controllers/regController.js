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

exports.searchRegPublic = catchAsync(async (req, res, next) => {
  const tag = req.params.tag;
  const registraions = await Registration.find({
    $or: [
      { admissionNo: tag },
      { tempID: tag },
      { mobile: Number(tag) || -1 },
      { email: tag }
    ]
  }).select("name admissionNo email tempID zealID");
  if (registraions.length == 0) {
    return next(new AppError("No registration found with that tag", 404));
  }
  res.status(200).json({
    status: "success",
    data: { registraions }
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

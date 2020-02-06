const Registration = require("./../models/regModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const restrict = require("./../utils/restrict");
const Counter = require("./../models/counter");

exports.getAllReg = (req, res, next) => {
  res.status(200).json({
    status: "Not implemented"
  });
};

exports.createReg = catchAsync(async (req, res, next) => {
  const data = restrict(req.body);

  const doc = await Registration.create(data);

  doc.entryLog = undefined;
  doc.zealID = undefined;
  doc.paymentMode = undefined;

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

exports.approveReg = catchAsync(async (req, res, next) => {
  const tempID = req.body.tempID;
  const zealCounter = await Counter.findById("zealID");

  const registration = await Registration.findOneAndUpdate(
    { tempID, approvedBy: null },
    {
      isPaid: true,
      approvedBy: req.user,
      zealID: zealCounter.seq,
      paymentMode: "cash"
    },
    { new: true }
  );

  if (!registration) {
    return next(new AppError("Invalid id or already approved", 400));
  }
  // called twice due to double update error
  await Counter.findByIdAndUpdate("zealID", { $inc: { seq: 1 } });

  res.status(200).json({
    status: "success"
  });
});

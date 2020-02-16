const Registration = require("./../models/regModel");
const User = require("./../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const restrict = require("./../utils/restrict");
const Counter = require("./../models/counter");
const getDay = require("../utils/getDay");
const mail = require("./../utils/email");
const axios = require("axios");

exports.getAllReg = (req, res, next) => {
  res.status(200).json({
    status: "Not implemented"
  });
};

exports.createReg = catchAsync(async (req, res, next) => {
  const data = restrict(req.body);
  // to avoid captcha during testing
  if (process.env.NODE_ENV != "test") {
    if (!data.token) {
      return next(new AppError("Capctha is not checked", 400));
    }
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${data.token}`;
    const response = await axios.post(verifyUrl);
    if (!response.success && response.success === undefined) {
      return next(new AppError("Captcha verification failed", 400));
    } else if (body.score < 0.7) {
      return next(new AppError("You might be a bot, sorry!", 400));
    }
  }

  const doc = await Registration.create(data);

  doc.entryLog = undefined;
  doc.zealID = undefined;
  doc.paymentMode = undefined;
  doc.approvedBy = undefined;

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

  mail(registration);

  res.status(200).json({
    status: "success"
  });
});

exports.regStats = catchAsync(async (req, res, next) => {
  const stats = await User.find({ role: "core-team" });
  let newStats = [];
  for (i = 0; i < stats.length; i++) {
    const reg = await Registration.find({ approvedBy: stats[i] });
    newStats.push({
      name: stats[i].name,
      email: stats[i].email,
      amount: reg.length * process.env["TICKET_COST"]
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      newStats
    }
  });
});

exports.coreStats = catchAsync(async (req, res, next) => {
  const stats = await Registration.aggregate([
    { $match: { approvedBy: req.user._id } },
    { $group: { _id: null, amount: { $sum: 1 * process.env["TICKET_COST"] } } }
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats
    }
  });
});

exports.entryStats = catchAsync(async (req, res, next) => {
  const tag = req.params.tag;
  const registration = await Registration.findOne({
    $or: [{ zealID: tag }, { mobile: Number(tag) || -1 }, { email: tag }],
    zealID: { $ne: null }
  }).select("name admissionNo email zealID entryLog");

  if (!registration) {
    return next(new AppError("No valid registration found with that tag", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      registration
    }
  });
});

exports.createEntryLog = catchAsync(async (req, res, next) => {
  const tag = req.params.tag;
  const key = String(getDay());
  const registration = await Registration.findOne({
    $or: [{ zealID: tag }, { mobile: Number(tag) || -1 }, { email: tag }],
    zealID: { $ne: null }
  }).select("name admissionNo email zealID entryLog tempID");

  if (!registration) {
    return next(new AppError("No valid registration found with that tag", 404));
  }
  registration.entryLog.set(String(key), {
    createdBy: req.user._id,
    createdAt: Date.now()
  });
  registration.save();
  // registration.tempID = undefined;
  res.status(200).json({
    status: "success",
    data: {
      registration
    }
  });
});

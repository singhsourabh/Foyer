const mongoose = require("mongoose");
const Counter = require("./counter");
const validator = require("validator");

const RegistrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required to register"],
      trim: true
    },
    admissionNo: {
      type: String,
      required: [true, "admission number is required"]
    },
    mobile: {
      type: String,
      required: [true, "mobile number is required"],
      validate: [
        str => validator.isMobilePhone(str, "en-IN"),
        "Please provide a valid mobile number"
      ],
      unique: true
    },
    email: {
      type: String,
      required: [true, "email address is required"],
      validate: [validator.isEmail, "Please provide a valid email"],
      unique: true
    },
    tempID: {
      type: String,
      unique: true
    },
    zealID: {
      type: String,
      default: null
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paymentMode: {
      type: String,
      enum: ["cash", "online", null],
      default: null
    },
    entryLog: {
      type: Map
    },
    approvedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: null
    },
    approvedAt: {
      type: Date,
      default: null
    },
    type: {
      type: String,
      enum: ["sole", "team"],
      default: "sole"
    }
  },
  { timestamps: true }
);

RegistrationSchema.pre("save", function(next) {
  var doc = this;
  Counter.findByIdAndUpdate({ _id: "tempID" }, { $inc: { seq: 1 } }, function(
    error,
    counter
  ) {
    if (error) {
      return next(error);
    }
    if (!doc.tempID) {
      doc.tempID = counter.seq;
      doc.entryLog = new Map();
    }
    next();
  });
});

const Registration = mongoose.model("Registration", RegistrationSchema);

module.exports = Registration;

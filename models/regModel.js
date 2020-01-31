const mongoose = require("mongoose");
const Counter = require("./counter");

const RegistrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required to register"],
    trim: true
  },
  admissionNo: {
    type: String,
    required: [true, "admission number is required"],
    unique: true
  },
  mobile: {
    type: String,
    required: [true, "mobile number is required"],
    match: [/^\d{10}$/, "please enter a valid mobile number"],
    unique: true
  },
  email: {
    type: String,
    required: [true, "email address is required"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "please enter a valid email address"
    ],
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
  }
});

RegistrationSchema.pre("save", function(next) {
  var doc = this;
  Counter.findByIdAndUpdate({ _id: "tempID" }, { $inc: { seq: 1 } }, function(
    error,
    counter
  ) {
    if (error) {
      return next(error);
    }
    doc.tempID = counter.seq;
    next();
  });
});

const Registration = mongoose.model("Registration", RegistrationSchema);
module.exports = Registration;

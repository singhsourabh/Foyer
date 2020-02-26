const mongoose = require("mongoose");

const TeamSchema = mongoose.Schema({
  leader: {
    type: String,
    required: [true, "Please tell us team leader name!"]
  },
  event: {
    type: String,
    required: [true, "Please tell us event name!"]
  },
  member: {
    type: Number,
    require: [true, "Please mention the participants count"]
  }
});

module.exports = mongoose.model("Team", TeamSchema);

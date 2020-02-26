const mongoose = require("mongoose");
const Counter = require("./../models/counter");
const User = require("./../models/userModel");

mongoose
  .connect("mongodb://localhost:27017/foyer", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("DB connected");
  });

const setCounter = async (name, seed) => {
  try {
    const doc = await Counter.create({ _id: name, seq: seed });
    console.log(doc);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const createAdmin = async (name, email, password) => {
  try {
    const newUser = await User.create({
      name: name,
      email: email,
      password: password,
      passwordConfirm: password,
      role: "admin"
    });
    console.log(newUser);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--setcounter") {
  setCounter(process.argv[3], process.argv[4]);
}
if (process.argv[2] === "--createadmin") {
  createAdmin(process.argv[3], process.argv[4], process.argv[5]);
}

// node dev-data/setup --setcounter tempID 5000 --setup command
// node dev-data/setup --createadmin admin admin@test.com qwerty123

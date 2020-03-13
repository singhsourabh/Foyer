const mongoose = require("mongoose");
const Counter = require("./../models/counter");
const User = require("./../models/userModel");

const setCounter = async name => {
  try {
    const doc = await Counter.create({ _id: name });
  } catch (err) {
    console.log(err);
  }
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
  } catch (err) {
    console.log(err);
  }
};

module.exports.connect = async () => {
  const mongooseOpts = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  };

  await mongoose.connect(process.env.DB, mongooseOpts);
  await setCounter("tempID");
  await setCounter("zealID");
  await createAdmin("admin", "admin@test.com", "qwerty123");
};

module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

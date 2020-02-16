const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Counter = require("./../models/counter");
const User = require("./../models/userModel");

const mongod = new MongoMemoryServer();

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
    // console.log(newUser);
  } catch (err) {
    console.log(err);
  }
};

module.exports.connect = async () => {
  const uri = await mongod.getConnectionString();

  const mongooseOpts = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  };

  await mongoose.connect(uri, mongooseOpts);
  await setCounter("tempID");
  await setCounter("zealID");
  await createAdmin("admin", "admin@test.com", "qwerty123");
};

module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

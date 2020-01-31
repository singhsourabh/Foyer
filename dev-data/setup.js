const mongoose = require("mongoose");
const Counter = require("./../models/counter");

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

const setCounter = async name => {
  try {
    const doc = await Counter.create({ _id: name });
    console.log(doc);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--setcounter") {
  setCounter(process.argv[3]);
}

// node dev-data/setup --setcounter tempID --setup command

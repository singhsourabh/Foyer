const dotenv = require("dotenv");
const mongoose = require("mongoose");
var cors = require("cors");

dotenv.config({ path: "./.env" });

const app = require("./app");
app.use(cors());

mongoose
  .connect(process.env.DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("DB connected");
  });

const port = 8000;
const server = app.listen(port, () => {
  console.log(`app running on port ${port}`);
});

process.on("unhandledRejection", err => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

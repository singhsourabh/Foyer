const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.use(authController.protect);

router.use(authController.restrictTo("admin", "core-team"));

router.route("/").post(userController.createUser);

module.exports = router;

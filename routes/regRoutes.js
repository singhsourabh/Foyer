const express = require("express");
const regController = require("./../controllers/regController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(regController.getAllReg)
  .post(regController.createReg);

router
  .route("/:tag")
  .get(regController.searchRegPublic)
  .patch(regController.updateReg)
  .delete(regController.delReg);

router
  .route("/approve")
  .post(
    authController.protect,
    authController.restrictTo("core-team"),
    regController.approveReg
  );

router
  .route("/core/:tag")
  .get(
    authController.protect,
    authController.restrictTo("core-team"),
    regController.findReg
  );

module.exports = router;

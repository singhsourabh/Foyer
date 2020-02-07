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
  .route("/stat/all")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    regController.regStats
  );

router
  .route("/approve")
  .post(
    authController.protect,
    authController.restrictTo("core-team"),
    regController.approveReg
  );

router
  .route("/management/:tag")
  .get(
    authController.protect,
    authController.restrictTo("management"),
    regController.entryStats
  )
  .post(
    authController.protect,
    authController.restrictTo("management"),
    regController.createEntryLog
  );
module.exports = router;

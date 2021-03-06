const express = require("express");
const regController = require("./../controllers/regController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/").post(authController.restrictBot, regController.createReg);

router.route("/search").get(regController.searchRegPublic);

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
  .route("/teamreg")
  .post(
    authController.protect,
    authController.restrictTo("core-team"),
    regController.createTeamReg
  );

router
  .route("/stat/core")
  .get(
    authController.protect,
    authController.restrictTo("core-team"),
    regController.coreStats
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

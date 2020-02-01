const express = require("express");
const regController = require("./../controllers/regController");

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

module.exports = router;

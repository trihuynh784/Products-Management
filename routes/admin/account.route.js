const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer();

const controller = require("../../controllers/admin/accounts.controller");
const validate = require("../../validates/admin/accounts.validate");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.editPatch,
  controller.editPatch
);

router.get("/detail/:id", controller.detail);

router.patch("/delete-item/:id", controller.deleteItem);

module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer();

const validate = require("../../validates/admin/articles.validate");
const controller = require("../../controllers/admin/articles.controller");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.get("/detail/:id", controller.detail);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch
);

router.patch("/delete-item/:id", controller.deleteItem);

module.exports = router;

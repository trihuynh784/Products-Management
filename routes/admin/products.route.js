const express = require("express");
const router = express.Router();
const multer = require("multer");
// const storageMulter = require("../../helpers/storageMulter");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer();
const validate = require("../../validates/admin/products.validate");
const controller = require("../../controllers/admin/products.controller");

router.get("/", controller.products);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.patch("/delete-item/:id", controller.deleteItem);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch
);

router.get("/detail/:id", controller.detail);

module.exports = router;

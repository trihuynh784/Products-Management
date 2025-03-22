const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer();
const validate = require("../../validates/admin/products-category.validate");

const controller = require("../../controllers/admin/products-category.controller");

// [GET] /products-category
router.get("/", controller.index);

// [GET] /products-category/create
router.get("/create", controller.create);

// [GET] /products-category/create
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

// [GET] /products-category/change-status/:status/:id
router.patch("/change-status/:status/:id", controller.changeStatus);

// [GET] /products-category/change-multi
router.patch("/change-multi", controller.changeMulti);

module.exports = router;

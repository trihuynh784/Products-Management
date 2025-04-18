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

// [POST] /products-category/create
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

// [PATCH] /products-category/change-status/:status/:id
router.patch("/change-status/:status/:id", controller.changeStatus);

// [PATCH] /products-category/change-multi
router.patch("/change-multi", controller.changeMulti);

// [GET] /products-category/detail/:id
router.get("/detail/:id", controller.detail);

// [GET] /products-category/edit/:id
router.get("/edit/:id", controller.edit);

// [PATCH] /products-category/edit/:id
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch
);

// [PATCH] /products-category/delete-item/:id
router.patch("/delete-item/:id", controller.deleteItem);

module.exports = router;

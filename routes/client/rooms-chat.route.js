const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const controller = require("../../controllers/client/rooms-chat.controller");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  controller.createPost
);

module.exports = router;

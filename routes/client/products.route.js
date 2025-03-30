const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/products.controller");

// Products
router.get("/", controller.index);

router.get("/:slugCategory", controller.category);

router.get("/detail/:slug", controller.detail);

module.exports = router;
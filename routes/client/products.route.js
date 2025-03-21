const express = require("express");
const controller = require("../../controllers/client/products.controller");
const router = express.Router();

// Products
router.get("/", controller.index);

router.get("/:slug", controller.detailSlug);

module.exports = router;
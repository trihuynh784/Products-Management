const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/chat.controller");

const roomChatMiddleware = require("../../middlewares/client/roomChat.middleware");

router.get("/:roomChatId", roomChatMiddleware.isAccessRoom, controller.index);

module.exports = router;

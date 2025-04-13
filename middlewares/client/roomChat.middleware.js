const RoomChat = require("../../models/roomChat.model");

module.exports.isAccessRoom = async (req, res, next) => {
  const roomChatId = req.params.roomChatId;
  const userId = res.locals.user._id;

  const isAccess = await RoomChat.findOne({
    _id: roomChatId,
    "users.user_id": userId,
    deleted: false,
  });

  if (isAccess) next();
  else res.redirect("/404");
};

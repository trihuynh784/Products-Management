const Chat = require("../../models/chat.model");
const RoomChat = require("../../models/roomChat.model");
const User = require("../../models/user.model");

const chatSocket = require("../../sockets/client/chat.socket");

const checkAvatar = (user) => {
  if (!user.avatar) user.avatar = "";
};

// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
  // SocketIO
  chatSocket(req, res);
  // End SocketIO

  const roomChatId = req.params.roomChatId;

  // Get chats from database
  const chats = await Chat.find({
    room_chat_id: roomChatId,
    deleted: false,
  });
  for (const chat of chats) {
    const user = await User.findOne({ _id: chat.user_id }).select("fullName");
    chat.fullName = user.fullName;
  }
  // End Get chats from database

  // Thông tin của phòng (title, avatar,...)
  let boxHead;
  const typeRoom = await RoomChat.findOne({
    _id: roomChatId,
  }).select("typeRoom");
  if (typeRoom.typeRoom == "friend") {
    const infoRoom = await User.findOne({
      _id: { $ne: res.locals.user.id },
      "friends.room_chat_id": roomChatId,
    }).select("fullName avatar");
    boxHead = {
      id: infoRoom.id,
      title: infoRoom.fullName,
      avatar: infoRoom.avatar,
    };
  } else if (typeRoom.typeRoom == "group") {
    boxHead = await RoomChat.findOne({
      _id: roomChatId,
    }).select("id title avatar");
  }
  checkAvatar(boxHead);
  // End Thông tin của phòng (title, avatar,...)

  res.render("client/pages/chat/index", {
    titlePage: "Trò chuyện ngay",
    chats: chats,
    boxHead: boxHead,
  });
};

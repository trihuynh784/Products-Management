const User = require("../../models/user.model");
const RoomChat = require("../../models/roomChat.model");

// [GET] /rooms-chat/
module.exports.index = async (req, res) => {
  const rooms = await RoomChat.find({
    "users.user_id": res.locals.user.id,
    typeRoom: "group",
    deleted: false,
  }).select("id title avatar");

  res.render("client/pages/rooms-chat/index", {
    titlePage: "Phòng trò chuyện",
    rooms: rooms,
  });
};

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const friends = await User.find({
    "friends.user_id": res.locals.user._id,
  }).select("id fullName");

  res.render("client/pages/rooms-chat/create", {
    titlePage: "Tạo phong trò chuyện",
    friends: friends,
  });
};

// [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
  let dataRoom = {
    title: req.body.title,
    avatar: req.body.avatar ? req.body.avatar : "",
    typeRoom: "group",
    users: [
      {
        user_id: res.locals.user.id,
        role: "superadmin",
      },
    ],
  };

  for (const user of req.body.users) {
    dataRoom.users.push({
      user_id: user,
      role: "member",
    });
  }

  const roomChat = new RoomChat(dataRoom);
  await roomChat.save();

  res.redirect(`/chat/${roomChat.id}`);
};

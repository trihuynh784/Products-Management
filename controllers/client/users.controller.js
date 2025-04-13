const RoomChat = require("../../models/roomChat.model");
const User = require("../../models/user.model");

const usersSocket = require("../../sockets/client/users.socket");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  // SocketIO
  usersSocket(res);
  // End SocketIO

  const myUser = await User.findById(res.locals.user._id);

  let ids = [];
  for (const friend of myUser.friends) {
    ids.push(friend.user_id);
  }

  const users = await User.find({
    $and: [
      { _id: { $ne: myUser._id } },
      { _id: { $nin: myUser.requestFriend } },
      { _id: { $nin: myUser.acceptFriend } },
      { _id: { $nin: ids } },
    ],
    status: "active",
    deleted: false,
  }).select("id avatar fullName");

  res.render("client/pages/users/not-friend", {
    titlePage: "Danh sách người dùng",
    users: users,
  });
};

// [GET] /users/request
module.exports.request = async (req, res) => {
  // SocketIO
  usersSocket(res);
  // End SocketIO

  const myUser = await User.findById(res.locals.user._id);

  const users = await User.find({
    _id: { $in: myUser.requestFriend },
    status: "active",
    deleted: false,
  }).select("id avatar fullName");

  res.render("client/pages/users/request", {
    titlePage: "Danh sách người dùng",
    users: users,
  });
};

// [GET] /users/accept
module.exports.accept = async (req, res) => {
  // SocketIO
  usersSocket(res);
  // End SocketIO

  const myUser = await User.findById(res.locals.user._id);

  const users = await User.find({
    _id: { $in: myUser.acceptFriend },
    status: "active",
    deleted: false,
  }).select("id avatar fullName");

  res.render("client/pages/users/accept", {
    titlePage: "Danh sách người dùng",
    users: users,
  });
};

// [GET] /users/friend
module.exports.friend = async (req, res) => {
  // SocketIO
  usersSocket(res);
  // End SocketIO

  const myUser = await User.findById(res.locals.user._id);

  let ids = [];
  for (const friend of myUser.friends) {
    ids.push(friend.user_id);
  }

  const users = await User.find({
    _id: { $in: ids },
    status: "active",
    deleted: false,
  }).select("id avatar fullName statusOnline friends");

  for (const user of users) {
    const room = user.friends.find((friend) => friend.user_id == myUser._id);
    user.room_chat_id = room.room_chat_id;
  }

  res.render("client/pages/users/friend", {
    titlePage: "Danh sách người dùng",
    users: users,
  });
};

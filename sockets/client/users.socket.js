const User = require("../../models/user.model");
const RoomChat = require("../../models/roomChat.model");

const checkAvatar = (infoUser) => {
  if (!infoUser.avatar) {
    infoUser.avatar = "";
  }
};

module.exports = (res) => {
  const userId = String(res.locals.user._id);

  _io.once("connection", async (socket) => {
    console.log("a user connected", socket.id);

    // Gửi lời mời
    socket.on("CLIENT_ADD_FRIEND", async (userIdSended) => {
      userIdSended = String(userIdSended);

      // kiểm tra xem trong list request của minh` đã có userIdSended
      const myUser = await User.findOne({
        _id: userId,
        requestFriend: userIdSended,
      });
      const otherUser = await User.findOne({
        _id: userIdSended,
        acceptFriend: userId,
      });

      if (!myUser && !otherUser) {
        await User.updateOne(
          { _id: userId },
          {
            $push: { requestFriend: userIdSended },
          }
        );
        await User.updateOne(
          { _id: userIdSended },
          {
            $push: { acceptFriend: userId },
          }
        );
      }

      const userA = await User.findById(userId);
      const userB = await User.findById(userIdSended);

      socket.emit("SERVER_SEND_LENGTH_REQUEST_FRIEND", {
        user_id: userId,
        length_request_friend: userA.requestFriend.length,
      });
      socket.broadcast.emit("SERVER_SEND_LENGTH_ACCEPT_FRIEND", {
        user_id: userIdSended,
        length_accept_friend: userB.acceptFriend.length,
      });

      // Lấy info của A trả cho B
      const infoUserA = await User.findById(userId).select(
        "id fullName avatar"
      );
      checkAvatar(infoUserA);
      socket.broadcast.emit("SERVER_RETURN_INFO_USER_SEND_REQUEST", {
        user_id: userIdSended,
        infoUser: infoUserA,
      });

      // Khi A gửi kết bạn sẽ xóa đi A bên not-friend B
      socket.broadcast.emit("SERVER_RETURN_REALTIME_ERASE_CARD_NOT_FRIEND", {
        user_id_emit: userId,
        user_id_on: userIdSended,
      });
    });

    // Hủy lời mời
    socket.on("CLIENT_CANCEL_REQUEST", async (userIdCanceled) => {
      userIdCanceled = String(userIdCanceled);

      // Kiểm tra xem trong myUser có id muốn cancel ko
      const myUser = await User.findOne({
        _id: userId,
        requestFriend: userIdCanceled,
      });
      const otherUser = await User.findOne({
        _id: userIdCanceled,
        acceptFriend: userId,
      });

      if (myUser && otherUser) {
        // Xóa request của myUser
        await User.updateOne(
          { _id: userId },
          {
            $pull: { requestFriend: userIdCanceled },
          }
        );
        // Xóa accept của otherUser
        await User.updateOne(
          { _id: userIdCanceled },
          {
            $pull: { acceptFriend: userId },
          }
        );
      }

      const userA = await User.findById(userId);
      const userB = await User.findById(userIdCanceled);

      socket.emit("SERVER_SEND_LENGTH_REQUEST_FRIEND", {
        user_id: userId,
        length_request_friend: userA.requestFriend.length,
      });
      socket.broadcast.emit("SERVER_SEND_LENGTH_ACCEPT_FRIEND", {
        user_id: userIdCanceled,
        length_accept_friend: userB.acceptFriend.length,
      });

      // Xóa B khi A hủy lời mời
      socket.broadcast.emit("SERVER_RETURN_REALTIME_CANCEL_REQUEST", {
        user_id_emit: userId,
        user_id_on: userIdCanceled,
      });

      // Khi A hủy kết bạn sẽ hiện lại A bên phía not-friend của B
      const infoUser = await User.findById(userId).select("id fullName avatar");
      checkAvatar(infoUser);
      socket.broadcast.emit(
        "SERVER_RETURN_REALTIME_NOT_FRIEND_WHEN_CANCEL_ACCEPT",
        {
          user_id_emit: userId,
          user_id_on: userIdCanceled,
          infoUser_emit: infoUser,
        }
      );
    });

    // Chấp nhận kết bạn
    socket.on("CLIENT_ACCEPT_FRIEND", async (userIdAccepted) => {
      userIdAccepted = String(userIdAccepted);

      const myUser = await User.findOne({
        _id: userId,
        acceptFriend: userIdAccepted,
      });
      const otherUser = await User.findOne({
        _id: userIdAccepted,
        requestFriend: userId,
      });

      const isExistRoomChat = await RoomChat.findOne({
        "users.user_id": { $all: [userId, userIdAccepted] },
      });

      let roomChat;
      if (myUser && otherUser && !isExistRoomChat) {
        roomChat = new RoomChat({
          typeRoom: "friend",
          users: [
            {
              user_id: userId,
              role: "superadmin",
            },
            {
              user_id: userIdAccepted,
              role: "superadmin",
            },
          ],
        });
        await roomChat.save();
      }

      if (myUser && otherUser) {
        await User.updateOne(
          { _id: userId },
          {
            $push: {
              friends: {
                user_id: userIdAccepted,
                room_chat_id: roomChat ? roomChat._id : isExistRoomChat._id,
              },
            },
            $pull: {
              acceptFriend: userIdAccepted,
            },
          }
        );
        await User.updateOne(
          { _id: userIdAccepted },
          {
            $push: {
              friends: {
                user_id: userId,
                room_chat_id: roomChat ? roomChat._id : isExistRoomChat._id,
              },
            },
            $pull: {
              requestFriend: userId,
            },
          }
        );
      }

      const userA = await User.findById(userId);
      const userB = await User.findById(userIdAccepted);

      socket.emit("SERVER_SEND_LENGTH_ACCEPT_FRIEND", {
        user_id: userId,
        length_accept_friend: userA.acceptFriend.length,
      });
      socket.emit("SERVER_SEND_LENGTH_FRIENDS", {
        user_id: userId,
        length_friends: userA.friends.length,
      });
      socket.broadcast.emit("SERVER_SEND_LENGTH_FRIENDS", {
        user_id: userIdAccepted,
        length_friends: userB.friends.length,
      });
      socket.broadcast.emit("SERVER_SEND_LENGTH_REQUEST_FRIEND", {
        user_id: userIdAccepted,
        length_request_friend: userB.requestFriend.length,
      });

      // Chấp nhận kết bạn realtime
      const infoUser = await User.findById(userId).select(
        "id fullName avatar statusOnline"
      );
      checkAvatar(infoUser);

      socket.broadcast.emit("SERVER_RETURN_REALTIME_ACCEPT", {
        user_id_on: userIdAccepted,
        infoUser_emit: infoUser,
        room_chat_id: roomChat ? roomChat._id : isExistRoomChat._id,
      });
    });

    // Từ chối kết bạn
    socket.on("CLIENT_CANCEL_ACCEPT", async (userIdACanceled) => {
      userIdACanceled = String(userIdACanceled);

      const myUser = await User.findOne({
        _id: userId,
        acceptFriend: userIdACanceled,
      });
      const otherUser = await User.findOne({
        _id: userIdACanceled,
        requestFriend: userId,
      });

      if (myUser && otherUser) {
        await User.updateOne(
          { _id: userId },
          {
            $pull: { acceptFriend: userIdACanceled },
          }
        );
        await User.updateOne(
          { _id: userIdACanceled },
          {
            $pull: { requestFriend: userId },
          }
        );
      }

      const userA = await User.findById(userId);
      const userB = await User.findById(userIdACanceled);

      socket.emit("SERVER_SEND_LENGTH_ACCEPT_FRIEND", {
        user_id: userId,
        length_accept_friend: userA.acceptFriend.length,
      });
      socket.broadcast.emit("SERVER_SEND_LENGTH_REQUEST_FRIEND", {
        user_id: userIdACanceled,
        length_request_friend: userB.requestFriend.length,
      });

      // Từ chối kết bạn realtime
      socket.broadcast.emit("SERVER_RETURN_REALTIME_REFUSE_ACCEPT", {
        user_id_emit: userId,
        user_id_on: userIdACanceled,
      });

      // Hiển thị lại B bên phía danh sách người dùng
      const infoUser = await User.findById(userId).select("id fullName avatar");
      checkAvatar(infoUser);
      socket.broadcast.emit(
        "SERVER_RETURN_REALTIME_NOT_FRIEND_WHEN_CANCEL_ACCEPT",
        {
          user_id_emit: userId,
          user_id_on: userIdACanceled,
          infoUser_emit: infoUser,
        }
      );
    });

    // Hủy kết bạn
    socket.on("CLIENT_DELETE_FRIEND", async (userIdDeleted) => {
      userIdDeleted = String(userIdDeleted);

      const myUser = await User.findOne({
        _id: userId,
        "friends.user_id": userIdDeleted,
      });
      const otherUser = await User.findOne({
        _id: userIdDeleted,
        "friends.user_id": userId,
      });

      if (myUser && otherUser) {
        await User.updateOne(
          { _id: userId },
          { $pull: { friends: { user_id: userIdDeleted } } }
        );
        await User.updateOne(
          { _id: userIdDeleted },
          { $pull: { friends: { user_id: userId } } }
        );
      }

      const userA = await User.findById(userId);
      const userB = await User.findById(userIdDeleted);

      socket.emit("SERVER_SEND_LENGTH_FRIENDS", {
        user_id: userId,
        length_friends: userA.friends.length,
      });
      socket.broadcast.emit("SERVER_SEND_LENGTH_FRIENDS", {
        user_id: userIdDeleted,
        length_friends: userB.friends.length,
      });

      // Khi A hủy kết bạn sẽ hiện lại A bên phía not-friend của B
      const infoUser = await User.findById(userId).select("id fullName avatar");
      checkAvatar(infoUser);
      socket.broadcast.emit(
        "SERVER_RETURN_REALTIME_NOT_FRIEND_WHEN_DELETE_FRIEND",
        {
          user_id_emit: userId,
          user_id_on: userIdDeleted,
          infoUser_emit: infoUser,
        }
      );

      // Khi A hủy kết bạn sẽ xóa A bên phía friend của B
      socket.broadcast.emit(
        "SERVER_RETURN_REALTIME_FRIEND_WHEN_DELETE_FRIEND",
        {
          user_id_emit: userId,
          user_id_on: userIdDeleted,
        }
      );
    });
  });
};

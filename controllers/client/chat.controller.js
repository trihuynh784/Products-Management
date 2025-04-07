const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

const uploadImgHelper = require("../../helpers/uploadFile");

module.exports.index = async (req, res) => {
  const userId = res.locals.user._id;
  const fullName = res.locals.user.fullName;

  // SocketIO
  _io.once("connection", (socket) => {
    console.log("a user connected", socket.id);
    // Messages
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      // Upload imgs to cloudinary
      let images = [];
      for (const image of data.images) {
        const link = await uploadImgHelper.upload(image);
        images.push(link);
      }

      // Save chat to database
      const chat = new Chat({
        user_id: userId,
        content: data.content,
        images: images,
      });
      await chat.save();

      // Return message for client
      _io.emit("SERVER_RETURN_MESSAGE", {
        user_id: userId,
        fullName: fullName,
        content: data.content,
        images: images,
      });
    });

    // Typing
    socket.on("CLIENT_SEND_TYPING", (type) => {
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        user_id: userId,
        fullName: fullName,
        type: type,
      });
    });
  });
  // End SocketIO

  // Get chats from database
  const chats = await Chat.find({
    deleted: false,
  });
  for (const chat of chats) {
    const user = await User.findOne({ _id: chat.user_id }).select("fullName");
    chat.fullName = user.fullName;
  }
  // End Get chats from database

  res.render("client/pages/chat/index", {
    titlePage: "Trò chuyện ngay",
    chats: chats,
  });
};

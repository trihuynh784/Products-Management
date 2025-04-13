const Chat = require("../../models/chat.model");
const uploadImgHelper = require("../../helpers/uploadFile");

module.exports = (req, res) => {
  const roomChatId = req.params.roomChatId;
  const userId = res.locals.user._id;
  const fullName = res.locals.user.fullName;

  _io.once("connection", (socket) => {
    console.log("a user connected", socket.id);
    // Create a room by socket
    socket.join(roomChatId);

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
        room_chat_id: roomChatId,
        content: data.content,
        images: images,
      });
      await chat.save();

      // Return message for client
      _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
        user_id: userId,
        fullName: fullName,
        content: data.content,
        images: images,
      });
    });

    // Typing
    socket.on("CLIENT_SEND_TYPING", (type) => {
      socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
        user_id: userId,
        fullName: fullName,
        type: type,
      });
    });
  });
};

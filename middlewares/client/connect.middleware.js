const User = require("../../models/user.model");

// module.exports.connect = async (req, res, next) => {
//   const user = await User.findOne({ tokenUser: req.cookies.tokenUser });
//   if (user) {
//     let timeout;
//     _io.once("connection", async (socket) => {
//       await User.updateOne({ _id: user._id }, { statusOnline: "online" });
//       socket.broadcast.emit("SERVER_RETURN_USER_ONLINE/OFFLINE", {
//         user_id: user._id,
//         status: "online",
//       });

//       clearTimeout(timeout);

//       socket.on("disconnect", async () => {
//         await User.updateOne({ _id: user._id }, { statusOnline: "offline" });
//         socket.broadcast.emit("SERVER_RETURN_USER_ONLINE/OFFLINE", {
//           user_id: user._id,
//           status: "offline",
//         });
//       });
//     });
//   }

//   next();
// };

module.exports.connect = async (req, res, next) => {
  // const user = await User.findOne({ tokenUser: req.cookies.tokenUser });
  // if (user) {
  //   _io.once("connection", async (socket) => {
  //     console.log("a user connected", socket.id);
  //     // await User.updateOne({ _id: user._id }, { statusOnline: "online" });
  //     // socket.broadcast.emit("SERVER_RETURN_USER_ONLINE/OFFLINE", {
  //     //   user_id: user._id,
  //     //   status: "online",
  //     // });

  //     socket.on("CLIENT_SEND_TAG_ONLINE/OFFLINE", async () => {
  //       console.log("a user disconnect", socket.id);
  //       // await User.updateOne({ _id: user._id }, { statusOnline: "offline" });
  //       // socket.broadcast.emit("SERVER_RETURN_USER_ONLINE/OFFLINE", {
  //       //   user_id: user._id,
  //       //   status: "offline",
  //       // });
  //     });
  //   });
  // }

  next();
};

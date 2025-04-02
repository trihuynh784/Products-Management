const User = require("../../models/user.model");

module.exports.checkTokenUser = async (req, res, next) => {
  if (req.cookies.tokenUser) {
    const user = await User.findOne({
      tokenUser: req.cookies.tokenUser, 
    }).select("-password");
    res.locals.user = user;
  }

  next();
};

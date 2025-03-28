const Account = require("../../models/account.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
  const token = req.cookies.token;
  const user = await Account.findOne({ token: token });
  
  if (user) {
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    return;
  }

  res.render("admin/pages/auth/login", {
    titlePage: "Trang đăng nhập"
  })
};

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;

  const user = await Account.findOne({
    email: email,
    deleted: false
  })

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }
  if (md5(password) != user.password) {
    req.flash("error", "Mật khẩu không chính xác!");
    res.redirect("back");
    return;
  }
  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đã bị khóa!");
    res.redirect("back");
    return;
  }

  res.cookie("token", user.token);
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};

// [GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("token");

  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};
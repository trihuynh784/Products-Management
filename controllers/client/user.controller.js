const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const md5 = require("md5");

const { generateNumberOtp } = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    titlePage: "Đăng nhập",
  });
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  }).select("password tokenUser status");

  if (!user) {
    req.flash("error", "Tài khoản không chính xác!");
    res.redirect("back");
    return;
  }

  if (user.password != md5(req.body.password)) {
    req.flash("error", "Mật khẩu không chính xác!");
    res.redirect("back");
    return;
  }

  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đã bị khóa!");
    res.redirect("back");
    return;
  }

  res.cookie("tokenUser", user.tokenUser);
  req.flash("success", "Đăng nhập thành công!");
  res.redirect("/");
};

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    titlePage: "Đăng ký tài khoản",
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const checkEmailExist = await User.findOne({
    email: req.body.email,
  });

  if (checkEmailExist) {
    req.flash("error", "Email đã tồn tại!");
    res.redirect("back");
    return;
  }

  req.body.password = md5(req.body.password);

  const user = new User(req.body);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);
  req.flash("success", "Đăng nhập thành công!");
  res.redirect("/");
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  req.flash("success", "Đăng xuất thành công!");
  res.redirect("/");
};

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    titlePage: "Quên mật khẩu",
  });
};

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const isExistForgotPassword = await ForgotPassword.findOne({
    email: email,
  });

  if (isExistForgotPassword) {
    req.flash("error", "OTP đã được gửi vui lòng đợi thời gian OTP hết hạn!");
    res.redirect("back");
    return;
  }

  const user = await User.findOne({
    email: email,
    deleted: false,
  }).select("-password");

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }

  const otp = generateNumberOtp(6);

  const objectOtp = {
    email: email,
    otp: otp,
    expireAt: Date.now(),
  };

  const forgotPassword = new ForgotPassword(objectOtp);
  await forgotPassword.save();

  // Đoạn này sẽ gửi mã OTP về gmail
  const subject = `Mã OTP của bạn: 785432 - Không chia sẻ với bất kỳ ai!`;
  const html = `<table align="center" width="100%" style="max-width: 500px; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
        <tr>
            <td align="center">
                <h2 style="color: #007bff; margin-bottom: 10px;">Mã OTP của bạn</h2>
                <p style="color: #555; font-size: 16px;">Sử dụng mã bên dưới để xác thực tài khoản của bạn.</p>

                <div style="font-size: 24px; font-weight: bold; background: #007bff; color: white; padding: 10px 20px; display: inline-block; border-radius: 5px; letter-spacing: 4px;">
                    ${otp}
                </div>

                <p style="color: #777; font-size: 14px; margin-top: 10px;">
                    Mã OTP này có hiệu lực trong <strong>3 phút</strong>.
                </p>

                <p style="color: #999; font-size: 12px; margin-top: 20px;">
                    Nếu bạn không yêu cầu mã OTP này, hãy bỏ qua email này.
                </p>
            </td>
        </tr>
    </table>`;
  sendMailHelper.send(email, subject, html);

  res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    titlePage: "Nhập mã OTP",
    email: email,
  });
};

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const objectForgotPassword = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });

  if (!objectForgotPassword) {
    req.flash("error", "OTP không tồn tại!");
    res.redirect("back");
    return;
  }

  const user = await User.findOne({
    email: email,
  });

  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đã bị khóa!");
    res.redirect("/user/password/forgot");
    return;
  }

  res.cookie("tokenUser", user.tokenUser);
  req.flash("Đăng nhập thành công!");
  res.redirect("/user/password/reset");
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    titlePage: "Đổi mật khẩu",
  });
};

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const email = req.cookies.tokenUser;

  await User.updateOne(
    {
      email: email,
    },
    {
      password: md5(password),
    }
  );

  req.flash("success", "Đổi mật khẩu thành công!");
  res.redirect("/");
};

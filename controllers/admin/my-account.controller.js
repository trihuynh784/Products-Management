const Account = require("../../models/account.model");
const md5 = require("md5");

// [GET] /my-account/index
module.exports.index = async (req, res) => {
  res.render("admin/pages/my-account/index", {
    titlePage: "Thông tin cá nhân",
  });
};

// [GET] /my-account/edit
module.exports.edit = async (req, res) => {
  res.render("admin/pages/my-account/edit", {
    titlePage: "Chỉnh sửa thông tin cá nhân",
  });
};

// [PATCH] /my-account/edit
module.exports.editPatch = async (req, res) => {
  const checkEmailExist = await Account.findOne({
    _id: { $ne: res.locals.user._id },
    deleted: false,
    email: req.body.email,
  });

  if (checkEmailExist) {
    req.flash("error", "Email đã tồn tại");
  } else {
    if (req.body.password.length > 0) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }

    await Account.updateOne({ _id: res.locals.user._id }, req.body);
  }
  res.redirect("back");
};

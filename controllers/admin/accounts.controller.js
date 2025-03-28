const Account = require("../../models/account.model");
const Role = require("../../models/roles.model");
const systemConfig = require("../../config/system");
const md5 = require("md5");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Account.find(find).select("-password -token");
  for (const record of records) {
    const role = await Role.findOne({
      deleted: false,
      _id: record.role_id,
    });
    record.role = role;
  }

  res.render("admin/pages/accounts/index", {
    titlePage: "Danh sách tài khoản",
    records: records,
  });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const roles = await Role.find(find);

  res.render("admin/pages/accounts/create", {
    titlePage: "Danh sách tài khoản",
    roles: roles,
  });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const checkEmailExist = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (checkEmailExist) {
    req.flash("error", "Email đã tồn tại!");
    res.redirect("back");
  } else {
    req.body.password = md5(req.body.password);

    const record = new Account(req.body);
    await record.save();

    req.flash("success", "Tạo tài khoản thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Account.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái tài khoản thành công!");

  res.redirect("back");
};

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  try {
    let find = {
      _id: req.params.id,
      deleted: false,
    };

    const record = await Account.findOne(find);
    const roles = await Role.find({ deleted: false });

    res.render("admin/pages/accounts/edit", {
      titlePage: "Danh sách tài khoản",
      roles: roles,
      record: record,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    let find = {
      _id: req.params.id,
      deleted: false,
    };

    const checkEmailExist = await Account.findOne({
      _id: { $ne: req.params.id },
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

      await Account.updateOne(find, req.body);
    }
    res.redirect("back");
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [PATCH] /admin/accounts/edit/:id
module.exports.detail = async (req, res) => {
  try {
    const record = await Account.findOne({ _id: req.params.id }).select("-password -token");
    
    const accountRole = await Role.findOne({ _id: record.role_id });

    res.render("admin/pages/accounts/detail", {
      titlePage: "Chi tiết tài khoản",
      record: record,
      accountRole: accountRole.title
    })
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [PATCH] /admin/accounts/delete-item/:id
module.exports.deleteItem = async (req, res) => {
  try {
    await Account.updateOne({ _id: req.params.id }, { deleted: true });

    res.redirect("back");
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

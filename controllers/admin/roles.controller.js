const Role = require("../../models/roles.model");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Role.find(find);

  for (const record of records) {
    const updatedBy = record.updatedBy.slice(-1)[0];
    if (updatedBy) {
      const user = await Account.findOne({
        _id: updatedBy.account_id,
      });

      updatedBy.fullName = user.fullName;
    }
  }

  res.render("admin/pages/roles/index", {
    titlePage: "Danh sách nhóm quyền",
    records: records,
  });
};

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    titlePage: "Tạo nhóm quyền",
  });
};

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  const record = new Role(req.body);
  await record.save();
  req.flash("success", "Tạo mới quyền thành công!");
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const record = await Role.findOne({ _id: req.params.id });

    res.render("admin/pages/roles/detail", {
      titlePage: "Chi tiết nhóm quyền",
      record: record,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };

    const record = await Role.findOne(find);

    res.render("admin/pages/roles/edit", {
      titlePage: "Chỉnh sửa nhóm quyền",
      record: record,
    });
  } catch (error) {
    req.flash("error", "Sai định dạng!");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  await Role.updateOne(
    { _id: req.params.id },
    {
      ...req.body,
      $push: {
        updatedBy: {
          account_id: res.locals.user._id,
          updatedAt: new Date(),
        },
      },
    }
  );

  req.flash("success", "Cập nhật nhóm quyền thành công!");
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [PATCH] /admin/roles/delete-item/:id
module.exports.deleteItem = async (req, res) => {
  try {
    await Role.updateOne({ _id: req.params.id }, { deleted: true });
    res.redirect("back");
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Role.find(find);

  res.render("admin/pages/roles/permissions", {
    titlePage: "Phân quyền",
    records: records,
  });
};

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  const permissions = JSON.parse(req.body.permissions);

  for (const item of permissions) {
    const id = item.id;
    const permissions = item.permissions;

    await Role.updateOne({ _id: id }, { permissions: permissions });
  }

  req.flash("success", "Cập nhật phân quyền thành công!");
  res.redirect("back");
};

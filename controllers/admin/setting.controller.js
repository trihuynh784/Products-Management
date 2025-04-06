const SettingGeneral = require("../../models/setting-general.model");

// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});

  res.render("admin/pages/settings/general", {
    titlePage: "Cài đặt chung",
    setting: settingGeneral,
  });
};

// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
  if (req.body.change_logo == "delete") {
    req.body.logo = "";
    delete req.body.change_logo;
  }
  
  const isExistSetting = await SettingGeneral.findOne({});

  if (isExistSetting) {
    await SettingGeneral.updateOne({}, req.body);
  } else {
    const settingGeneral = new SettingGeneral(req.body);
    await settingGeneral.save();
  }

  req.flash("success", "Cập nhật thành công!");
  res.redirect("back");
};

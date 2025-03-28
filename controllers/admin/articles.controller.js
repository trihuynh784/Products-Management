const Articles = require("../../models/articles.model");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");

// [GET] /admin/articles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  // Filter Status
  const filterStatus = filterStatusHelper(req.query);
  if (req.query.status) {
    find.status = req.query.status;
  }

  // Search
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }

  const articles = await Articles.find(find).sort(sort);

  for (const article of articles) {
    const user = await Account.findOne({ _id: article.createdBy.account_id });

    if (user) {
      article.createdBy.fullName = user.fullName;
    }
  }

  res.render("admin/pages/articles/index", {
    titlePage: "Quản lý bài viết",
    articles: articles,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
  });
};

// [GET] /admin/articles/create
module.exports.create = (req, res) => {
  res.render("admin/pages/articles/create", {
    titlePage: "Tạo mới bài viết",
  });
};

// [POST] /admin/articles/create
module.exports.createPost = async (req, res) => {
  req.body.createdBy = {
    account_id: res.locals.user._id,
  };

  if (req.body.position == "") {
    const countRecords = await Articles.countDocuments();
    req.body.position = countRecords + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const record = new Articles(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/articles`);
};

// [PATCH] /admin/articles/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  await Articles.updateOne(
    { _id: req.params.id },
    { status: req.params.status }
  );

  res.redirect("back");
};

// [GET] /admin/articles/detail/:id
module.exports.detail = async (req, res) => {
  const record = await Articles.findOne({ _id: req.params.id });

  res.render("admin/pages/articles/detail", {
    titlePage: "Chi tiết bài viết",
    record: record,
  });
};

// [GET] /admin/articles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const record = await Articles.findOne({ _id: req.params.id });

    res.render("admin/pages/articles/edit", {
      titlePage: "Chỉnh sửa bài viết",
      record: record,
    });
  } catch (error) {
    req.flash("error", "Không tìm thấy sản phẩm!");
    res.redirect(`${systemConfig.prefixAdmin}/articles`);
  }
};

// [PATCH] /admin/articles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    await Articles.updateOne({ _id: req.params.id }, req.body);
  } catch (error) {
    req.flash("error", "Lỗi !!!");
  }
  res.redirect(`${systemConfig.prefixAdmin}/articles`);
};

// [PATCH] /admin/articles/delete-item/:id
module.exports.deleteItem = async (req, res) => {
  await Articles.updateOne({ _id: req.params.id }, { deleted: true });
  req.flash("success", "Xóa thành công bài viết!");
  res.redirect("back");
};


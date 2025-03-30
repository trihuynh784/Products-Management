const ProductsCategory = require("../../models/products-category.model");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");

// [GET] /admin/products-category
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
  const sort = {
    position: "desc",
  };

  let records = await ProductsCategory.find(find).sort(sort);

  records = createTreeHelper.createTree(records);

  for (const record of records) {  
    const lastIndex = record.updatedBy.length - 1;
    if (lastIndex >= 0) {
      const updatedBy = record.updatedBy[lastIndex];
  
      const user = await Account.findOne({ _id: updatedBy.account_id });
  
      if (user) {
        record.updatedBy[lastIndex].fullName = user.fullName;
      }
    }
  }

  res.render("admin/pages/products-category/index", {
    titlePage: "Danh mục sản phẩm",
    records: records,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
  });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  const find = {
    deleted: false,
  };

  let records = await ProductsCategory.find(find).lean();

  records = createTreeHelper.createTree(records);

  res.render("admin/pages/products-category/create", {
    titlePage: "Thêm mới danh mục sản phẩm",
    records: records,
  });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const count = await ProductsCategory.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const record = new ProductsCategory(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

// [PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };

    if (req.params) {
      find.status = req.params.status;
    }

    await ProductsCategory.updateOne({ _id: req.params.id }, find);
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Không tìm thấy yêu cầu !");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

// [PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
  if (req.body) {
    const ids = req.body.ids.split(", ");

    switch (req.body.type) {
      case "active":
        await ProductsCategory.updateMany(
          { _id: { $in: ids } },
          { status: "active" }
        );
        req.flash(
          "success",
          `Cập nhật trạng thái cho ${ids.length} danh mục thành công`
        );
        break;
      case "inactive":
        await ProductsCategory.updateMany(
          { _id: { $in: ids } },
          { status: "inactive" }
        );
        req.flash(
          "success",
          `Cập nhật trạng thái cho ${ids.length} danh mục thành công`
        );
        break;
      case "delete-all":
        await ProductsCategory.updateMany(
          { _id: { $in: ids } },
          { deleted: true }
        );
        req.flash("success", `Xóa ${ids.length} danh mục thành công`);
        break;
      case "position":
        ids.forEach(async (id) => {
          const [categoryId, position] = id.split("-");
          await ProductsCategory.updateOne(
            { _id: categoryId },
            { position: position }
          );
        });
        req.flash(
          "success",
          `Cập nhật vị trí cho ${ids.length} danh mục thành công`
        );
        break;
      default:
        break;
    }

    res.redirect("back");
  }
};

// [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
  let category = {};
  if (req.params) {
    category = await ProductsCategory.findOne({ _id: req.params.id });
  }

  res.render("admin/pages/products-category/detail", {
    titlePage: "Chi tiết danh mục",
    category: category,
  });
};

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    let record = {};
    if (req.params) {
      record = await ProductsCategory.findOne({ _id: req.params.id });
    }

    const find = {
      deleted: false,
    };

    let records = await ProductsCategory.find(find).lean();

    records = createTreeHelper.createTree(records);

    res.render("admin/pages/products-category/edit", {
      titlePage: "Chỉnh sửa danh mục",
      record: record,
      records: records,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

// [PATCH] /admin/products-category/editPatch/:id
module.exports.editPatch = async (req, res) => {
  await ProductsCategory.updateOne(
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

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

// [PATCH] /admin/products-category/deleteItem/:id
module.exports.deleteItem = async (req, res) => {
  if (req.params) {
    await ProductsCategory.updateOne({ _id: req.params.id }, { deleted: true });
  }

  res.redirect("back");
};

const ProductsCategory = require("../../models/products-category.model");
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

  let records = await ProductsCategory.find(find);

  records = createTreeHelper.createTree(records);

  res.render("admin/pages/products-category/index", {
    titlePage: "Danh mục sản phẩm",
    records: records,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword
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

// [POST] /admin/products-category/change-status/:status/:id
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

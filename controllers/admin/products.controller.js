const Products = require("../../models/products.model");
const ProductsCategory = require("../../models/products-category.model");
const Account = require("../../models/account.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const createTreeHelper = require("../../helpers/createTree");
const systemConfig = require("../../config/system");

// [GET] /admin/products
module.exports.products = async (req, res) => {
  let find = {
    deleted: false,
  };

  // Filter Status
  const filterStatus = filterStatusHelper(req.query);

  // Search
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  if (req.query.status) {
    find.status = req.query.status;
  }

  // Pagination
  let objectPagination = {
    currentPage: 1,
    limitProducts: 4,
  };
  const countProducts = await Products.countDocuments(find);
  objectPagination = paginationHelper(
    req.query,
    objectPagination,
    countProducts
  );
  // End Pagination

  // Sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // End Sort

  // Call Products
  const products = await Products.find(find)
    .sort(sort)
    .limit(objectPagination.limitProducts)
    .skip(objectPagination.skip);

  for (const product of products) {
    const user = await Account.findOne({
      _id: product.createdBy.account_id,
    });

    if (user) {
      product.accountFullName = user.fullName;
    }

    const updatedBy = product.updatedBy.slice(-1)[0];
    if (updatedBy) {
      const userUpdated = await Account.findOne({
        _id: updatedBy.account_id
      })

      updatedBy.accountFullName = userUpdated.fullName;
    }
  }

  res.render("admin/pages/products/index", {
    titlePage: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Products.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái sản phẩm thành công!");

  res.redirect("back");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await Products.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash(
        "success",
        `Cập nhật trạng thái cho ${ids.length} sản phẩm thành công!`
      );
      break;
    case "inactive":
      await Products.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash(
        "success",
        `Cập nhật trạng thái cho ${ids.length} sản phẩm thành công!`
      );
      break;
    case "delete-all":
      await Products.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user._id,
            deletedAt: new Date(),
          },
        }
      );
      req.flash("success", `Xóa ${ids.length} sản phẩm thành công!`);
      break;
    case "position":
      ids.forEach(async (item) => {
        const [id, position] = item.split("-");
        await Products.updateOne({ _id: id }, { position: position });
      });
      req.flash(
        "success",
        `Đã đổi vị trí thành công cho ${ids.length} sản phẩm thành công!`
      );
      break;
    default:
      break;
  }

  res.redirect("back");
};

// [PATCH] /admin/products/delete-item
module.exports.deleteItem = async (req, res) => {
  // console.log(req.get("Referrer") || prefixAdmin);

  await Products.updateOne(
    { _id: req.params.id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user._id,
        deletedAt: new Date(),
      },
    }
  );

  req.flash("success", "Xóa sản phẩm thành công!");

  res.redirect(req.get("Referrer") || prefixAdmin);
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  const find = {
    deleted: false,
  };

  let records = await ProductsCategory.find(find).lean();

  records = createTreeHelper.createTree(records);

  res.render("admin/pages/products/create", {
    titlePage: "Thêm mới sản phẩm",
    records: records,
  });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Products.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  req.body.createdBy = {
    account_id: res.locals.user._id,
  };

  const product = new Products(req.body);
  await product.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };

    const product = await Products.findOne(find);

    let records = await ProductsCategory.find({ deleted: false }).lean();

    records = createTreeHelper.createTree(records);

    res.render("admin/pages/products/edit", {
      titlePage: "Chỉnh sửa sản phẩm",
      product: product,
      records: records,
    });
  } catch (error) {
    req.flash("error", "Không tồn tại sản phẩm này!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    const updatedBy = {
      account_id: res.locals.user._id,
      updatedAt: new Date(),
    };

    await Products.updateOne(
      { _id: req.params.id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );

    req.flash("success", "Cập nhật sản phẩm thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật sản phẩm thất bại!");
  }

  res.redirect("back");
};

// [PATCH] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Products.findOne(find);

    const category = await ProductsCategory.findOne({ _id: product.category });

    res.render("admin/pages/products/detail", {
      titlePage: product.title,
      product: product,
      category: category.title,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

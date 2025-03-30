const Product = require("../../models/products.model");
const ProductsCategory = require("../../models/products-category.model");
const productsHelper = require("../../helpers/product");
const productsCategoryHelper = require("../../helpers/products-category");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: "false",
  })
    .sort({ position: "desc" })
    .lean();

  const newProducts = productsHelper.priceNewProducts(products);

  res.render("client/pages/products/products", {
    titlePage: "Danh sách sản phẩm",
    products: newProducts,
  });
};

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  let find = {
    deleted: false,
    status: "active",
    slug: req.params.slugCategory,
  };

  const category = await ProductsCategory.findOne(find);

  const listSubCategory = await productsCategoryHelper.getSubCategory(
    category._id
  );
  const listSubCategoryId = listSubCategory.map((item) => item._id);

  const products = await Product.find({
    category: { $in: [category._id, ...listSubCategoryId] },
    deleted: false,
    status: "active",
  }).sort({ position: "desc" });

  const newProducts = productsHelper.priceNewProducts(products);

  res.render("client/pages/products/products", {
    titlePage: category.title,
    products: newProducts,
  });
};

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
  try {
    const product = await Product.findOne({
      status: "active",
      deleted: false,
      slug: req.params.slug,
    });

    if (product.category) {
      const categoryData = await ProductsCategory.findOne({
        _id: product.category,
      });
      product.categoryData = categoryData;
    }

    product.priceNew = productsHelper.priceNewProduct(product);

    res.render("client/pages/products/detail", {
      titlePage: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect("/");
  }
};

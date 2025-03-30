const Product = require("../../models/products.model");
const productsHelper = require("../../helpers/product");

// [GET] /
module.exports.index = async (req, res) => {
  // Sản phẩm nổi bật
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).sort({ position: "desc" });

  const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);
  //Hết sản phẩm nổi bật

  // Sản phẩm mới nhất
  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(6);

  const newProductsNew = productsHelper.priceNewProducts(productsFeatured);
  // Hết Sản phẩm mới nhất

  res.render("client/pages/home/home", {
    titlePage: "Trang chủ",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew,
  });
};

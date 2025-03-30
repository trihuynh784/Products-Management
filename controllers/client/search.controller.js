const Product = require("../../models/products.model");
const productsHelper = require("../../helpers/product");

// [GET] /search?keyword=value
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword.trim();
  const regex = RegExp(keyword, "i");
  const products = await Product.find({
    deleted: false,
    status: "active",
    title: regex
  }).sort({ position: "desc" });

  const newProducts = productsHelper.priceNewProducts(products);

  res.render("client/pages/search/index", {
    titlePage: "Kết quả tìm kiếm",
    keyword: keyword,
    products: newProducts,
  })
}
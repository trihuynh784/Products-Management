const Product = require("../../models/products.model");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: "false",
  })
    .sort({ position: "desc" })
    .lean();

  const newProducts = products.map((item) => {
    item.priceNew = parseInt(
      ((item.price * (100 - item.discountPercentage)) / 100).toFixed(0)
    );
    return item;
  });

  res.render("client/pages/products/products", {
    titlePage: "Danh sách sản phẩm",
    products: newProducts,
  });
};

// [GET] /products/:slug
module.exports.detailSlug = async (req, res) => {
  try {
    let find = {
      deleted: false,
      status: "active",
      slug: req.params.slug,
    };

    const product = await Product.findOne(find);

    res.render("client/pages/products/detail", {
      titlePage: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect("/products");
  }
};

const Cart = require("../../models/cart.model");
const Product = require("../../models/products.model");
const Order = require("../../models/order.model");

const productHelper = require("../../helpers/product");

// [GET] /checkout/
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cartId,
  });

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productInfo = await Product.findOne({
        _id: item.product_id,
      }).select("thumbnail title slug price discountPercentage");

      productInfo.priceNew = productHelper.priceNewProduct(productInfo);

      item.productInfo = productInfo;

      item.totalPrice = productInfo.priceNew * item.quantity;
    }
  }

  cart.totalPrice = cart.products.reduce(
    (total, item) => (total += item.totalPrice),
    0
  );

  res.render("client/pages/checkout/index", {
    titlePage: "Đặt hàng",
    cartDetail: cart,
  });
};

// [GET] /checkout/order
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;

  const cart = await Cart.findById(cartId);
  let products = [];
  for (const product of cart.products) {
    let objectProduct = {
      product_id: product.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: product.quantity,
    };

    const productInfo = await Product.findById(product.product_id);

    objectProduct.price = productInfo.price;
    objectProduct.discountPercentage = productInfo.discountPercentage;

    products.push(objectProduct);
  }

  const orderInfo = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products,
  };

  const order = new Order(orderInfo);
  await order.save();

  await Cart.updateOne(
    { _id: cartId },
    {
      products: [],
    }
  );

  res.redirect(`/checkout/success/${order._id}`);
};

// [GET] /checkout/success
module.exports.success = async (req, res) => {
  const order = await Order.findById(req.params.orderId);

  if (order.products.length > 0) {
    for (const item of order.products) {
      const productInfo = await Product.findOne({
        _id: item.product_id,
      }).select("thumbnail title");

      item.priceNew = productHelper.priceNewProduct(item);

      item.productInfo = productInfo;

      item.totalPrice = item.priceNew * item.quantity;
    }
  }

  order.totalPrice = order.products.reduce(
    (total, item) => (total += item.totalPrice),
    0
  );

  res.render("client/pages/checkout/success", {
    titlePage: "Đặt hàng thành công",
    order: order
  });
};

const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    const cart = new Cart();
    await cart.save();

    const expires = 1000 * 60 * 60 * 24 * 365;

    console.log(cart);
    res.cookie("cartId", cart._id, { expires: new Date(Date.now() + expires) });
  } else {
    const cart = await Cart.findOne({
      _id: req.cookies.cartId
    })
    
    cart.totalQuantity = cart.products.reduce(((total, item) => total += item.quantity), 0);

    res.locals.miniCart = cart;
  }

  next();
}
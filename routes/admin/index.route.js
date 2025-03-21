const systemConfig = require("../../config/system");
const dashboardRoutes = require("./dashboard.route");
const productsRoutes = require("./products.route");
const productsCategoryRoutes = require("./products-category.route");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);

  app.use(PATH_ADMIN + "/products", productsRoutes);

  app.use(PATH_ADMIN + "/products-category", productsCategoryRoutes);
}
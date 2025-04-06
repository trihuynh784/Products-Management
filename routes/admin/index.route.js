const systemConfig = require("../../config/system");
const dashboardRoutes = require("./dashboard.route");
const productsRoutes = require("./products.route");
const productsCategoryRoutes = require("./products-category.route");
const rolesRoutes = require("./roles.route");
const articlesRoutes = require("./articles.route");
const accountsRoutes = require("./account.route");
const authRoutes = require("./auth.route");
const myAccountRoutes = require("./my-account.route");
const settingRoutes = require("./setting.route");

const authMiddleware = require("../../middlewares/admin/auth.middleware");
const settingMiddleware = require("../../middlewares/admin/setting.middleware");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(settingMiddleware.settingGeneral);

  app.use(
    PATH_ADMIN + "/dashboard",
    authMiddleware.requireAuth,
    dashboardRoutes
  );

  app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productsRoutes);

  app.use(
    PATH_ADMIN + "/products-category",
    authMiddleware.requireAuth,
    productsCategoryRoutes
  );
  
  app.use(PATH_ADMIN + "/articles", authMiddleware.requireAuth, articlesRoutes);

  app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, rolesRoutes);

  app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountsRoutes);

  app.use(PATH_ADMIN + "/my-account", authMiddleware.requireAuth, myAccountRoutes);

  app.use(PATH_ADMIN + "/settings", authMiddleware.requireAuth, settingRoutes);

  app.use(PATH_ADMIN + "/auth", authRoutes);
};

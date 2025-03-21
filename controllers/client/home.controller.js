// [GET] /
module.exports.index = (req, res) => {
  res.render("client/pages/home/home", { titlePage: "Trang chủ" });
};

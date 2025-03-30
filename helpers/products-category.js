const ProductsCategory = require("../models/products-category.model");

module.exports.getSubCategory = async (parentId) => {
  const getSubCategory = async (parentId) => {
    const subs = await ProductsCategory.find({
      parent_id: parentId,
      deleted: false,
      status: "active"
    });

    let allSub = [...subs];

    for (const sub of subs) {
      const childs = await getSubCategory(sub._id);
      allSub = allSub.concat(childs);
    }
    return allSub;
  }

  return getSubCategory(parentId);
}
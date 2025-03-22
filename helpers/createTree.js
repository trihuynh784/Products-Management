let count = 0;
const tree = (arr, parentId) => {
  const newArr = [];
  arr.forEach(item => {
    if (item.parent_id === parentId) {
      const newItem = item;
      newItem.index = ++count;
      const children = tree(arr, item._id.toString());
      if (children.length > 0) {
        newItem.children = children;
      }
      newArr.push(newItem);
    }
  });
  return newArr;
}

module.exports.createTree = (arr, parentId = "") => {
  count = 0;
  const newTree = tree(arr, parentId);
  return newTree;
};
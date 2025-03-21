module.exports = (query, objectPagination, countProducts) => {
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }
  objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitProducts;
  objectPagination.totalPage = Math.ceil(countProducts / objectPagination.limitProducts);

  return objectPagination;
}
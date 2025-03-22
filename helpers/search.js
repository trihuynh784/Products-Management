module.exports = (query) => {
  const objectSearch = {
    keyword: ""
  };

  if(query.keyword) {
    objectSearch.keyword = query.keyword.trim();
    objectSearch.regex = new RegExp(objectSearch.keyword, "i");
  }

  return objectSearch;
}
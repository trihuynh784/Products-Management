// Change Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
buttonsChangeStatus.forEach((button) => {
  const formChangeStatus = document.getElementById("form-change-status");
  let path = formChangeStatus.getAttribute("data-path");

  button.addEventListener("click", () => {
    const currentStatus = button.getAttribute("data-status");
    const changeStatus = currentStatus == "active" ? "inactive" : "active";
    const id = button.getAttribute("data-id");

    const action = path + `/${changeStatus}/${id}?_method=PATCH`;
    formChangeStatus.action = action;
    formChangeStatus.submit();
  });
});
// End Change Status

// Delete Item
const deleteItem = document.getElementById("form-delete-item");
const buttonDeleteItem = document.querySelectorAll("#button-delete-item");

buttonDeleteItem.forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.value;
    const path = deleteItem.getAttribute("data-path");

    deleteItem.action = path + `/${id}?_method=PATCH`;
    deleteItem.submit();
  });
});
// End Delete Item

// Sort
const sort = document.querySelector("[sort]");
if (sort) {
  let url = new URL(window.location.href);
  const sortSelect = sort.querySelector("select[sort-select]");

  // Sort
  sortSelect.addEventListener("change", (e) => {
    const [sortKey, sortValue] = e.target.value.split("-");

    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);

    window.location.href = url.href;
  });

  // Selected
  const sortKey = url.searchParams.get("sortKey");
  const sortValue = url.searchParams.get("sortValue");
  if (sortKey && sortValue) {
    const optionSelected = sortSelect.querySelector(`option[value="${sortKey}-${sortValue}"]`);
    optionSelected.selected = true;
  }

  // Clear
  const sortClear = sort.querySelector("button[sort-clear]");
  sortClear.addEventListener("click", () => {
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");

    window.location.href = url.href;
  });
}
// End Sort
// Button Status
const buttonsStatus = document.querySelectorAll("[button-status]");
buttonsStatus.forEach((button) => {
  button.addEventListener("click", () => {
    const status = button.getAttribute("button-status");
    const url = new URL(window.location.href);

    if (status) {
      url.searchParams.set("status", status);
      url.searchParams.set("page", 1);
    } else {
      url.searchParams.delete("status");
    }

    window.location.href = url.href;
  });
});
// End Button Status

// Form Search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;
    console.log(e.target.elements.keyword.value);

    const url = new URL(window.location.href);

    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }

    window.location.href = url.href;
  });
}
// End Form Search

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
buttonsPagination.forEach((button) => {
  button.addEventListener("click", () => {
    const page = button.getAttribute("button-pagination");

    const url = new URL(window.location.href);
    url.searchParams.set("page", page);
    window.location.href = url.href;
  });
});
// End Pagination

// Checkbox
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const checkAll = checkboxMulti.querySelector("input[name='checkAll']");
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

  if (checkAll) {
    checkAll.addEventListener("click", () => {
      inputsId.forEach((input) => {
        input.checked = checkAll.checked ? true : false;
      });
    });
  }

  inputsId.forEach((input) => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked"
      ).length;

      if (countChecked == inputsId.length) {
        checkAll.checked = true;
      } else {
        checkAll.checked = false;
      }
    });
  });
}
// End Checkbox

// Delete Item
const deleteItem = document.getElementById("form-delete-item");
if (deleteItem) {
  const buttonDeleteItem = document.querySelectorAll("#button-delete-item");

  buttonDeleteItem.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.value;
      const path = deleteItem.getAttribute("data-path");

      deleteItem.action = path + `/${id}?_method=PATCH`;
      deleteItem.submit();
    });
  });
}
// End Delete Item

// Change Status
const buttonsChangeStatus = document.querySelectorAll(
  "a[button-change-status]"
);
if (buttonsChangeStatus.length) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");
  buttonsChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("data-status") == "active" ? "inactive" : "active";
      const id = button.getAttribute("data-id");
      formChangeStatus.action = path + `/${status}/${id}?_method=PATCH`;
      formChangeStatus.submit();
    });
  });
}
// End Change Status

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
    const optionSelected = sortSelect.querySelector(
      `option[value="${sortKey}-${sortValue}"]`
    );
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

// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputsChecked = checkboxMulti.querySelectorAll(
      "input[name='id']:checked"
    );
    if (inputsChecked.length) {
      let ids = [];
      inputsChecked.forEach((input) => {
        ids.push(input.value);
      });

      const typeChange = e.target.elements.type.value;
      if (typeChange == "delete-all") {
        const isConfirm = confirm("Bạn có chắc muốn xóa không ?");
        if (!isConfirm) return;
      }

      if (typeChange == "position") {
        const inputsPosition = [];
        inputsChecked.forEach((input) => {
          const inputPosition = `${input.value}-${
            input.closest("tr").querySelector("input[name='position']").value
          }`;
          inputsPosition.push(inputPosition);
        });
        ids = inputsPosition;
      }

      const inputChangeMulti =
        formChangeMulti.querySelector("input[name='ids']");
      inputChangeMulti.value = ids.join(", ");

      formChangeMulti.submit();
    }
  });
}
// End Form Change Multi

// Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const closeAlert = showAlert.querySelector("[close-alert]");
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, parseInt(showAlert.getAttribute("data-time")));
}
// End Show Alert

// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector(
    "[upload-image-preview]"
  );
  const closeImagePreview = uploadImage.querySelector("[close-image-preview]");

  closeImagePreview.addEventListener("click", () => {
    uploadImageInput.value = "";
    uploadImagePreview.src = "";
  });

  uploadImageInput.addEventListener("change", (e) => {
    const [file] = e.target.files;

    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
      closeImagePreview.classList.remove("dis-none");
    }
  });
}
// End Upload Image

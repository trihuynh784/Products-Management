// Change Status
const buttonsChangeStatus = document.querySelectorAll(
  "a[button-change-status]"
);
if (buttonsChangeStatus) {
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

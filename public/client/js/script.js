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
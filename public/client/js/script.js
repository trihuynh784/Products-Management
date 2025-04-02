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

// Buy Now
const formBuyNow = document.querySelector("[form-buy-now]");
if (formBuyNow) {
  const buttonsBuyNow = document.querySelectorAll("[button-buy-now]");
  buttonsBuyNow.forEach((button) => {

    button.addEventListener("click", () => {
      const productId = button.getAttribute("product-id");

      formBuyNow.action = `/checkout/buynow/${productId}`;
      formBuyNow.submit();
    });
  });
}
// End Buy Now

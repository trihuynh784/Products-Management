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

// Upload Image Preview
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const input = uploadImage.querySelector("[upload-image-input]");
  const changeAvatar = uploadImage.querySelector("[change-avatar]");
  const preview = uploadImage.querySelector("[upload-image-preview]");
  const closeBtn = uploadImage.querySelector("[close-image-preview]");

  const togglePreview = (show) => {
    closeBtn.classList.toggle("d-none", !show);
  };

  input.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (file) {
      preview.src = URL.createObjectURL(file);
      togglePreview(true);
    }
  });

  closeBtn.addEventListener("click", () => {
    changeAvatar.value = "delete";
    preview.src = "";
    togglePreview(false);
  });

  if (preview.getAttribute("src") == "") {
    togglePreview(false);
  } else {
    togglePreview(true);
  }
}
// End Upload Image Preview

// Detect browser or tab closing
window.addEventListener("beforeunload", (e) => {
  socket.emit("CLIENT_SEND_TAG_ONLINE/OFFLINE");
});
// End Detect browser or tab closing

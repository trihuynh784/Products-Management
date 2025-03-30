// Cập nhật lại số lượng sản phẩm
const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if (inputsQuantity) {
  inputsQuantity.forEach(input => {
    input.addEventListener("change", () => {
      const productId = input.getAttribute("product-id");
      const quantity = input.value;

      window.location.href = `/cart/update/${productId}/${quantity}`;
    })
  });
}
// Hết Cập nhật lại số lượng sản phẩm
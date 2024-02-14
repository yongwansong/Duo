document.addEventListener("DOMContentLoaded", () => {
  const selectQuantity = document.querySelector("#select-quantity");
  selectQuantity.addEventListener("change", (e) => changeSelect(e))

});


const changeSelect = (event) => {
  
  const inputQuantity = document.querySelector(".quantity__input");
  
  inputQuantity.value = event.target.value;

}
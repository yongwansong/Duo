
document.addEventListener("DOMContentLoaded", () => {
  const selectQuantity = document.querySelector(".subsgo");
  const selectQuantityOnTime = document.querySelector(".onetimego");
  selectQuantity.addEventListener("click", (e) => selectDefault(e));
  selectQuantityOnTime.addEventListener("click", (e) => selectDefaultOneTime(e))

});

const selectDefault = (e) => {
  const parent = e.target.closest('.container');

  const radios = parent.querySelectorAll('variant-radios input[type="radio"]');


  if (radios.length > 0) {
    radios[0].click();
  }
}

const selectDefaultOneTime = (e) => {
  const inputQuantity = document.querySelector(".quantity__input");
  const select = document.querySelector("#select-quantity");
  select.value = 1;
  inputQuantity.value = 1
}



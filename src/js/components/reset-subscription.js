
document.addEventListener("DOMContentLoaded", () => {
  const selectQuantity = document.querySelector(".subsgo");
  selectQuantity.addEventListener("click", (e) => selectDefault(e))

});

const selectDefault = (e) => {
  const parent = e.target.closest('.container');

  const radios = parent.querySelectorAll('variant-radios input[type="radio"]');


  if (radios.length > 0) {
    radios[0].click();
  }
}


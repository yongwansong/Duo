// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Find the selectQuantity and selectQuantityOnTime elements
  const selectQuantity = document.querySelector(".subsgo");
  const selectQuantityOnTime = document.querySelector(".onetimego");

  // Add a click event listener to the selectQuantity element
  selectQuantity.addEventListener("click", (e) => selectDefault(e));
  if (!selectQuantityOnTime.hasAttribute('disabled')) {
    selectQuantityOnTime.addEventListener("click", (e) => selectOneTimePurchace(e));
  }
});

// Function to set the default radio button selection


const selectDefault = (e) => {
  const parent = e.target.closest('.container');

  const radios = parent.querySelectorAll('variant-radios input[type="radio"]');

  const selectDefault = document.querySelector("#select-quantity");

  const dataSelectMetafieldToFind = selectDefault.dataset.selectMetafield

  const options = selectDefault.querySelectorAll('option');

  let positionToClick = -1; 
  options.forEach((option, index) => {
    if (option.value === dataSelectMetafieldToFind) {
      option.selected = true;
      positionToClick = index;
    }
  });

  if (positionToClick !== -1) {
    radios[positionToClick].click();
    return;
  }

  radios[0].click();
}

const selectOneTimePurchace = (e) => {

  const parent = e.target.closest('.container');
  const radios = parent.querySelectorAll('variant-radios input[type="radio"]');

  if (radios.length > 0) {
    radios[4].click();
  }
}



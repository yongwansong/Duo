// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Find the selectQuantity and selectQuantityOnTime elements
  const selectQuantity = document.querySelector(".subsgo");
  const selectQuantityOnTime = document.querySelector(".onetimego");

  // Add a click event listener to the selectQuantity element
  selectQuantity.addEventListener("click", (e) => selectDefault(e));
  selectQuantityOnTime.addEventListener("click", (e) => selectOneTimePurchace(e));
});

// Function to set the default radio button selection
const selectDefault = (e) => {

   // Find the closest parent container element
   const parent = e.target.closest('.container');

  // Find all radio buttons inside the parent container
  const radios = parent.querySelectorAll('variant-radios input[type="radio"]');

  // If there are radio buttons, click the first one to set it as default
  if (radios.length > 0) {
    console.log('ejecurta');
    radios[0].click();
  } 
}

const selectOneTimePurchace = (e) => {

  const parent = e.target.closest('.container');
  const radios = parent.querySelectorAll('variant-radios input[type="radio"]');

  if (radios.length > 0) {
    radios[3].click();
  }
}



/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/components/reset-subscription.js":
/*!*************************************************!*\
  !*** ./src/js/components/reset-subscription.js ***!
  \*************************************************/
/***/ (() => {

// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Find the selectQuantity and selectQuantityOnTime elements
  var selectQuantity = document.querySelector(".subsgo");
  var selectQuantityOnTime = document.querySelector(".onetimego");

  // Add a click event listener to the selectQuantity element
  selectQuantity.addEventListener("click", function (e) {
    return selectDefault(e);
  });
  if (!selectQuantityOnTime.hasAttribute('disabled')) {
    selectQuantityOnTime.addEventListener("click", function (e) {
      return selectOneTimePurchace(e);
    });
  }
});

// Function to set the default radio button selection

var selectDefault = function selectDefault(e) {
  var parent = e.target.closest('.container');
  var radios = parent.querySelectorAll('variant-radios input[type="radio"]');
  var selectDefault = document.querySelector("#select-quantity");
  var dataSelectMetafieldToFind = selectDefault.dataset.selectMetafield;
  var options = selectDefault.querySelectorAll('option');
  var positionToClick = -1;
  options.forEach(function (option, index) {
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
};
var selectOneTimePurchace = function selectOneTimePurchace(e) {
  var parent = e.target.closest('.container');
  var radios = parent.querySelectorAll('variant-radios input[type="radio"]');
  if (radios.length > 0) {
    radios[4].click();
  }
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!****************************!*\
  !*** ./src/js/products.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_reset_subscription__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/reset-subscription */ "./src/js/components/reset-subscription.js");
/* harmony import */ var _components_reset_subscription__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_components_reset_subscription__WEBPACK_IMPORTED_MODULE_0__);

})();

/******/ })()
;
//# sourceMappingURL=endrock.scripts-product.js.map
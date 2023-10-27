//Global functions

// returns the parsed product json we had put in loop-widget-standard.liquid file's script tag.
function getProductJson(productId) {
  let loopProduct = JSON.parse(
    document.querySelector(`.loopProductQuickJson-${productId}`).textContent
  );
  return loopProduct;
}

// returns our widget container inside form
function getLoopSubscriptionContainer(productId) {
  let prod = getProductJson(productId);
  let loopSubscriptionContainer = document.querySelector(
    `#loop-subscription-container-${productId || prod.id}`
  );
  return loopSubscriptionContainer;
}

// makes a map object of instances of a key
arrToInstanceCountObj = (arr) =>
  arr.reduce((obj, e) => {
    obj[e] = (obj[e] || 0) + 1;
    return obj;
  }, {});

// returns variant from from window loop props
// if selected then returns selected variant id else first variant id
function findSelectedVariantLoop(productId, variantId) {
  let selectedVariantId = null;
  let product = {};
  if (
    window.loopProps &&
    window.loopProps[productId] &&
    window.loopProps[productId].product
  ) {
    product = window.loopProps[productId].product;
  } else {
    product = getProductJson(productId);
  }

  // if already have variantId
  if (variantId) {
    let selectedVariant =
      product.variants &&
      product.variants.find(
        (variant) => Number(variant.id) === Number(variantId)
      );

    return selectedVariant;
  }

  if (!selectedVariantId) {
    selectedVariantId = window.loopProps[productId].selectedVariantId;
  }

  if (!selectedVariantId) {
    const { variants } = product;
    if (variants && Array.isArray(variants) && variants.length) {
      selectedVariantId = variants[0].id;
    }
  }

  let selectedVariant =
    product.variants &&
    product.variants.find(
      (variant) => Number(variant.id) === Number(selectedVariantId)
    );

  return selectedVariant;
}

// clicking the selcted variant after 300ms
function defaultSelectFirstSellingPlanLoop(variant, productId) {
  let notCheckedYet = true;
  let loopPurchaseOptions =
    getLoopSubscriptionContainer(productId).querySelectorAll(
      "input[name=loop_purchase_option]"
    ) || [];
  loopPurchaseOptions.forEach((element) => {
    if (Number(element.dataset.variantId) === Number(variant.id)) {
      if (notCheckedYet) {
        notCheckedYet = false;
        element.checked = true;
        setTimeout(function () {
          element.click();
        }, 300);
      }
    }
  });
}

// hides Purchase Option label text
function hideLoopPurchaseOptionsLabel(productId) {
  let elements = getLoopSubscriptionContainer(productId).querySelectorAll(
    ".loop-purchase-options-label"
  );
  if (elements) {
    elements.forEach((element) => {
      if (element) {
        element.classList.add(
          "loop-display-none",
          "loop-display-none-by-variant"
        );
      }
    });
  }
}

// adds Purchase Option label text
function addLoopPurchaseOptionLabelText(productId) {
  let elements = getLoopSubscriptionContainer(productId).querySelectorAll(
    ".loop-purchase-options-label"
  );
  if (elements) {
    elements.forEach((element) => {
      if (element) {
        element.innerHTML = `${
          window.loopPropsUI.loopPurchaseOptionslabel || "Purchase Options"
        }`;
      }
    });
  }
}

// One time purchase label text
function addLoopOneTimePurchaseOptionLabelText(productId) {
  let elements = getLoopSubscriptionContainer(productId).querySelectorAll(
    ".loop-one-time-purchase-option-label"
  );
  if (elements) {
    elements.forEach((element) => {
      if (element) {
        element.innerHTML = `${
          window.loopPropsUI.loopOneTimePurchaselabel || "One time Purchase"
        }`;
      }
    });
  }
}

// Renders One time purchase option at bottom
function showOneTimePurchaseOptionAtBottom(productId) {
  let elementAtTop = getLoopSubscriptionContainer(productId).querySelector(
    "#loop-one-time-purchase-option-at-top"
  );
  let elementAtBottom = getLoopSubscriptionContainer(productId).querySelector(
    "#loop-one-time-purchase-option-at-bottom"
  );
  if (elementAtTop && elementAtBottom) {
    if (elementAtTop.innerHTML) {
      elementAtBottom.innerHTML = elementAtTop.innerHTML;
      elementAtTop.innerHTML = ``;
    }
  }

  let loopSubscriptionGroupElement = getLoopSubscriptionContainer(
    productId
  ).querySelectorAll(".loop-subscription-group");
  if (loopSubscriptionGroupElement) {
    loopSubscriptionGroupElement.forEach((element) => {
      element.classList.remove("loop-subscription-group-border-top");
      element.classList.add("loop-subscription-group-border-bottom");
    });
  }
}

// Hides "Each" label in Price
function hideEachLabelForPrice() {
  let loopSubscriptionOnPriceEachLabel = document.querySelectorAll(
    ".loop-subscription-group-price-quantity"
  );
  if (loopSubscriptionOnPriceEachLabel) {
    loopSubscriptionOnPriceEachLabel.forEach((element) => {
      element.classList.add("loop-display-none");
    });
  }

  let loopOneTimePurchaseOnPriceEachLabel = document.querySelectorAll(
    ".loop-one-time-purchase-option-price-quantity"
  );
  if (loopOneTimePurchaseOnPriceEachLabel) {
    loopOneTimePurchaseOnPriceEachLabel.forEach((element) => {
      element.classList.add("loop-display-none");
    });
  }
}

// for displaying tooltip => removes loop-display-none class
function displayTooltip(productId) {
  const loopContainer = getLoopSubscriptionContainer(productId);

  let element = loopContainer.querySelector("#loop-tooltip");
  if (element) {
    element.classList.remove("loop-display-none");
    let label = loopContainer.querySelector("#loop-tooltip-label");
    if (label) {
      label.innerHTML = window.loopPropsUI.subscriptionPopupLabel;
    }
    let description = loopContainer.querySelector("#loop-tooltip-description");
    if (description) {
      description.innerHTML = window.loopPropsUI.subscriptionPopupDescription;
    }
    if (label && description) {
      label.style.fill = window.getComputedStyle(description).color;
    }
  }
}

// for hiding tooltip => adds loop-display-none class
function hideTooltip(productId) {
  let element = getLoopSubscriptionContainer(productId).querySelector(
    "#loop-tooltip"
  );
  if (element) {
    element.classList.add("loop-display-none");
  }
}

// adds extra css styles and classes on loop-style
function addExtraLoopStyles() {
  if (window && window.loopPropsUI && window.loopPropsUI.style) {
    let classList = {
      purchase_option_label: [".loop-purchase-options-label"],
      widget_feildset: [".loop-selling-plan-fieldset"],
      selling_plan_group_container: [
        ".loop-one-time-purchase-option",
        ".loop-subscription-group",
      ],
      selling_plan_group_label: [
        ".loop-one-time-purchase-option-label",
        ".loop-subscription-group-label",
      ],
      selling_plan_label: [".loop-selling-plan-selector-label"],
      selling_plan_selector: [".loop-selling-plan-selector"],
      selling_plan_price_label: [
        ".loop-one-time-purchase-option-price-amount",
        ".loop-subscription-group-price-amount",
      ],
      selling_plan_price_subtitle_label: [
        ".loop-one-time-purchase-option-price-quantity",
        ".loop-subscription-group-price-quantity",
      ],
      selling_plan_description_label: [
        ".loop-selling-plan-selector-description",
      ],
      selling_plan_discount_badge_style: [
        ".loop-subscription-group-discount-badge",
      ],
      subscription_details_label: [".loop-tooltip-label"],
      subscription_details_popup: [
        ".loop-tooltiptext",
        ".loop-container-arrow",
        ".loop-tooltip-description",
      ],
      selling_plan_group_selected: [".loop-selected-selling-plan-group"],
      selling_plan_group_radio: [
        ".loop-subscription-group-radio",
        ".loop-one-time-purchase-option-radio",
      ],
    };
    const getProperties = ({ id, data }) => {
      if (data) {
        let keys = Object.keys(data);
        let properties = "";
        keys.forEach((key) => {
          let value = data[key];
          properties = `${properties} ${key}: ${value} !important;`;
        });
        return properties;
      } else {
        return "";
      }
    };
    const getClassName = ({ id, data }) => {
      return classList[id] || [];
    };

    let extraClasses = ``;
    const { style } = window.loopPropsUI;
    style.map((st) => {
      let classNames = getClassName(st);
      classNames.map((className) => {
        extraClasses =
          extraClasses +
          `
                 ${className} {
                     ${getProperties(st)}
                 }
             `;
      });
    });

    let loopStyles = document.querySelectorAll(".loop-style");
    if (loopStyles) {
      loopStyles.forEach((element) => {
        element.innerHTML = `${element.innerHTML}
                 ${extraClasses}
             `;
      });
    }
  }

  if (window && window.loopPropsUI && window.loopPropsUI.cssClassess) {
    let loopStyles = document.querySelectorAll(".loop-style");
    if (loopStyles) {
      loopStyles.forEach((element) => {
        element.innerHTML = `${element.innerHTML}
                 ${window.loopPropsUI.cssClassess}
             `;
      });
    }
  }
}

// Changes based on loopProspsUI
function applySettings({ productId }) {
  let product = window.loopProps[productId].product;
  const variant = findSelectedVariantLoop(productId);
  if (
    window &&
    window.loopPropsUI &&
    window.loopPropsUI.displayLoopPurchaseOptionLabel === false
  ) {
    hideLoopPurchaseOptionsLabel(productId);
  }

  if (
    window &&
    window.loopPropsUI &&
    window.loopPropsUI.loopPurchaseOptionslabel
  ) {
    addLoopPurchaseOptionLabelText(productId);
  }

  if (
    window &&
    window.loopPropsUI &&
    window.loopPropsUI.loopOneTimePurchaselabel
  ) {
    addLoopOneTimePurchaseOptionLabelText(productId);
  }

  if (
    window &&
    window.loopPropsUI &&
    window.loopPropsUI.displayOneTimePurchaseOptionAtBottom
  ) {
    showOneTimePurchaseOptionAtBottom(productId);

    //**************  setting up the listeners which are already set  **************//
    // const loopOneTimeOptions = getLoopSubscriptionContainer(
    //   productId
    // ).querySelectorAll(".loop-one-time-purchase-option");
    // loopOneTimeOptions.forEach((option) => {
    //   option.addEventListener("click", clickOnSellingPlanGroupContainer);
    // });
    // const loopPurchaseOptions = getLoopSubscriptionContainer(
    //   productId
    // ).querySelectorAll("input[name=loop_purchase_option]");
    // loopPurchaseOptions.forEach((option) => {
    //   option.addEventListener("click", changeInSellingPlanGroupLoop);
    // });
  }

  if (
    window &&
    window.loopPropsUI &&
    window.loopPropsUI.displayEachLabelForPrice === false
  ) {
    hideEachLabelForPrice();
  }

  if (
    window &&
    window.loopPropsUI &&
    window.loopPropsUI.hidePlanSelectorIfOnlyOne
  ) {
    const { availableSellingPlanAllocations = [] } = window.loopProps[
      productId
    ];
    let ids = [];
    availableSellingPlanAllocations.map((a) => {
      ids.push(a.selling_plan_group_id);
    });

    let idCount = arrToInstanceCountObj(ids);
    Object.keys(idCount).forEach((key) => {
      let plan = idCount[key];
      if (plan === 1) {
        let id = `#loop-selling-plan-container-${variant.id}-${key}`;
        let parentElement = document.querySelector(id);
        if (parentElement) {
          let label = parentElement.querySelector(
            ".loop-selling-plan-selector-label"
          );
          let labelPlan = parentElement.querySelector(
            `#loop-selling-plan-first-delivery-options-${variant.id}-${key}`
          );
          let planSelector = parentElement.querySelector(
            ".loop-selling-plan-selector"
          );
          if (label) {
            label.classList.add("loop-display-none");
          }
          if (labelPlan) {
            labelPlan.classList.add("loop-display-none");
          }
          if (planSelector) {
            planSelector.classList.add("loop-display-none");
          }
        }
      }
    });
  }

  if (
    window &&
    window.loopPropsUI &&
    window.loopPropsUI.showPlanSelectorAsTextIfOnlyOnePlan &&
    !window.loopPropsUI.hidePlanSelectorIfOnlyOne
  ) {
    const { availableSellingPlanAllocations = [] } = window.loopProps[
      productId
    ];
    let ids = [];
    availableSellingPlanAllocations.map((a) => {
      ids.push(a.selling_plan_group_id);
    });

    let idCount = arrToInstanceCountObj(ids);
    Object.keys(idCount).forEach((key) => {
      let plan = idCount[key];
      if (plan === 1) {
        let id = `#loop-selling-plan-first-delivery-options-${variant.id}-${key}`;
        let element = document.querySelector(id);
        if (element && element.classList) {
          element.classList.remove("loop-display-none");
        }
        id = `#loop-select-${variant.id}-${key}`;
        element = document.querySelector(id);
        if (element) {
          element.classList.add("loop-display-none");
        }
      }
    });
  }

  if (
    window &&
    window.loopPropsUI &&
    window.loopPropsUI.hideWholeWidgetIfOnlyOnePlan
  ) {
    if (product.requires_selling_plan) {
      //check if only for selling plan
      if (
        variant.selling_plan_allocations &&
        variant.selling_plan_allocations.length === 1
      ) {
        //has only 1 selling plan

        hideSellingPlanFieldset(productId);
        hideLoopPurchaseOptionsLabel(productId);
      }
    }
  }

  if (
    window &&
    window.loopPropsUI &&
    window.loopPropsUI.hideRadioButtonIfOnlyOnePlan
  ) {
    if (product.requires_selling_plan) {
      //check if only for selling plan

      const { availableSellingPlanAllocations } = window.loopProps[productId];
      let ids = [];
      availableSellingPlanAllocations.map((a) => {
        ids.push(a.selling_plan_group_id);
      });
      let idCount = arrToInstanceCountObj(ids);
      let onlyOneSellingPlanGroup = false;
      if (Object.keys(idCount).length === 1) {
        onlyOneSellingPlanGroup = true;
      } else {
        onlyOneSellingPlanGroup = false;
      }

      if (onlyOneSellingPlanGroup) {
        //has only 1 selling plan

        let loopSubscriptionGroupRadio = getLoopSubscriptionContainer(
          productId
        ).querySelectorAll(".loop-subscription-group-radio");
        if (loopSubscriptionGroupRadio) {
          loopSubscriptionGroupRadio.forEach((element) => {
            element.classList.add("loop-display-none");
          });
        }
        let elements = getLoopSubscriptionContainer(productId).querySelectorAll(
          `.loop-subscription-group-selling-plans-container`
        );
        if (elements) {
          elements.forEach((element) => {
            element.classList.add("loop-left-margin-0");
          });
        }
      }
    }
  }

  addExtraLoopStyles();

  if (
    window &&
    window.loopPropsUI &&
    window.loopPropsUI.displaySubscriptionPopup &&
    variant &&
    variant.selling_plan_allocations &&
    variant.selling_plan_allocations.length
  ) {
    displayTooltip(productId);
  } else {
    hideTooltip(productId);
  }

  if (
    product &&
    product.requires_selling_plan &&
    Array.isArray(variant.selling_plan_allocations) &&
    variant.selling_plan_allocations.length
  ) {
    let parentId = `#loop-product-variant-${variant.id}`;
    let parentElement = getLoopSubscriptionContainer(productId).querySelector(
      parentId
    );

    if (
      window &&
      window.loopPropsUI &&
      window.loopPropsUI.displayOneTimePurchaseOptionAtBottom
    ) {
      let id = `.loop-subscription-group`;
      let elements = parentElement.querySelectorAll(id);
      if (elements && elements.length) {
        let last = elements[elements.length - 1];
        last.style.borderBottom = "0";
        last.classList.remove("loop-subscription-group-border-bottom");
      }
    } else {
      let id = `.loop-subscription-group`;
      let elements = parentElement.querySelectorAll(id);
      if (elements && elements.length) {
        let first = elements[0];
        first.style.borderTop = "0";
        first.classList.remove("loop-subscription-group-border-top");
      }
    }
  }

  if (window && window.loopPropsUI && window.loopPropsUI.displayDiscountBadge) {
    displayDiscountBadge({ productId });
  } else {
    let loopSubscriptionDiscountBadge = document.querySelectorAll(
      ".loop-subscription-group-discount-badge"
    );
    if (loopSubscriptionDiscountBadge) {
      loopSubscriptionDiscountBadge.forEach((element) => {
        if (element) {
          element.classList.add("loop-display-none");
        }
      });
    }
  }

  if (window && window.loopPropsUI && window.loopPropsUI.translationData) {
    let translationData = window.loopPropsUI.translationData || {};
    let mapElements = {
      widget_price_label_text: [
        ".loop-one-time-purchase-option-price-quantity",
        ".loop-subscription-group-price-quantity",
      ],
    };

    Object.keys(mapElements).forEach((key) => {
      if (translationData && translationData[key]) {
        let elementIds = mapElements[key];
        elementIds.map((id) => {
          let elements = document.querySelectorAll(id);
          if (elements) {
            elements.forEach((element) => {
              element.innerText = translationData[key];
            });
          }
        });
      }
    });
  }
}

// clicking the first purchase option on selling plan group change
function clickOnSellingPlanGroupContainer(event) {
  let container = event.target.closest(".loop-subscription-group");
  let radio = null;
  if (!container) {
    container = event.target.closest(".loop-one-time-purchase-option");
  }
  radio = container.querySelector('input[type="radio"]');
  if (
    radio?.dataset?.id !==
    window.loopProps[radio.dataset.productId].sellingPlanGroupId
  ) {
    radio.click();
  }
}

loopPriceSelectors = [
  ".price:not(.price--on-sale) .price__regular .price-item--regular",
  ".price.price--on-sale .price__sale .price-item--sale",
  ".product-single__prices .product__price:not(.product__price--compare)",
  ".product-pricing .product--price .price--main .money",
  "[data-zp-product-discount-price]",
  ".product-single__header .product__price",
  ".modal_price .current_price",
  ".product-area__col--price .current-price.theme-money",
  '[data-product-type="price"][data-pf-type="ProductPrice"]',
  ".product__price .fs-heading-4-base[data-price]",
  "#product-price .money[data-product-price]",
  "#ProductPrice",
  ".product-single__price",
  ".price:not(.price--on-sale) span.price-item--regular",
  ".product-price .price .money:not(.original)",
  ".price-box #price .price",
  ".product__price span[data-product-price]",
  ".product-form--price-wrapper .product-form--price",
  ".product-page--pricing--variant-price #price-field",
  ".price-reviews .product-price",
];

// on variant change
function variantChanged({ loopProduct, variantId }) {
  loopInit({
    productId: loopProduct.id,
    product: JSON.parse(JSON.stringify(loopProduct)),
    variantId,
  });
}

// hides or shows loop-widget
function checkVariantsSellingPlanAllocation(variant, productId) {
  if (
    !variant ||
    !Array.isArray(variant.selling_plan_allocations) ||
    !variant.selling_plan_allocations.length
  ) {
    //hide loop widget
    hideSellingPlanFieldset(productId);
    hideLoopPurchaseOptionsLabel(productId);
  } else {
    //display loop widget
    showSellingPlanFieldset(productId);
    showLoopPurchaseOptionsLabel(productId);
  }
}

// handles displying our variants and calls apply settings afterwards
function loopInit({ productId, product, variantId }) {
  updateLoopProperties({
    product,
    productId,
    variantId: variantId,
  });

  const variant = findSelectedVariantLoop(productId, variantId);

  // displaying current selected variant and hiding others
  let vId = variant.id;
  product.variants.map((variant) => {
    if (variant.id == vId) {
      document.querySelector(
        `#loop-product-variant-${variant.id}`
      ).style.display = "block";
    } else {
      document.querySelector(
        `#loop-product-variant-${variant.id}`
      ).style.display = "none";
    }
  });

  checkVariantsSellingPlanAllocation(variant, productId);

  if (
    window &&
    window.loopPropsUI &&
    window.loopPropsUI.byDefaultChooseSubscriptionOption
  ) {
    defaultSelectFirstSellingPlanLoop(variant, productId);
  } else {
    defaultSelectOneTimePurchaseOption(variant, productId);
  }
  applySettings({ productId });
}

// makes one time purchase option selected
function defaultSelectOneTimePurchaseOption(variant, productId) {
  const onetimeCheckRadioLoop = getLoopSubscriptionContainer(
    productId
  ).querySelector(`#loop-one-time-purchase-${productId}`);
  if (onetimeCheckRadioLoop) {
    onetimeCheckRadioLoop.checked = true;
    onetimeCheckRadioLoop.click();
  } else {
    defaultSelectFirstSellingPlanLoop(variant, productId);
  }
}

// makes the choosen selling plan selected
function updateSelectDropDownDefaultValues({
  productId,
  variant,
  sellingPlanGroupId,
}) {
  const { selling_plan_groups } = window.loopProps[productId].product;
  if (
    selling_plan_groups &&
    Array.isArray(selling_plan_groups) &&
    selling_plan_groups.length
  ) {
    selling_plan_groups.map((spg) => {
      if (sellingPlanGroupId !== spg.id) {
        let selectTag = document.getElementById(
          `loop-select-${variant.id}-${spg.id}`
        );
        if (selectTag) {
          selectTag.options[0].selected = true;
        }
      }
    });
  }
}

// on change of selling plan group
function changeInSellingPlanGroupLoop(option) {
  let sellingPlanGroupId = option.target.dataset.id;
  let sellingPlanGroupName = option.target.dataset.name;
  let productId = option.target.dataset.productId;
  const variant = findSelectedVariantLoop(
    productId,
    window.loopProps[productId].selectedVariantId
  );
  let sellingPlans =
    variant.selling_plan_allocations.filter(
      (spa) => spa.selling_plan_group_id === sellingPlanGroupId
    ) || [];
  let sellingPlan = sellingPlans && sellingPlans.length ? sellingPlans[0] : {};
  let sellingPlanId = sellingPlan.selling_plan_id;
  updateLoopProperties({
    productId,
    variantId: variant.id,
    sellingPlanGroupId,
    sellingPlanGroupName,
    sellingPlanId,
    sellingPlan,
  });
  updateSelectDropDownDefaultValues({
    productId,
    variant,
    sellingPlanGroupId: option.target.dataset.id,
  });
  updatePriceInParentElements({ productId });
  updateSellingPlanDescriptionUI({ productId });
  displayDiscountBadge({ productId });
  updateCartButtonText({ productId });
  updatePriceInUI({ productId });

  let removeElementId = ".loop-selected-selling-plan-group";
  let elements = getLoopSubscriptionContainer(productId).querySelectorAll(
    removeElementId
  );
  if (elements) {
    elements.forEach((element) => {
      if (element) {
        element.classList.remove("loop-selected-selling-plan-group");
      }
    });
  }
  if (sellingPlanGroupId === "loop-one-time-purchase") {
    let elements = getLoopSubscriptionContainer(productId).querySelectorAll(
      ".loop-one-time-purchase-option"
    );
    if (elements) {
      elements.forEach((element) => {
        element.classList.add("loop-selected-selling-plan-group");
      });
    }
  } else {
    let elementId = `#loop-${variant.id}-${sellingPlanGroupId}`;
    let element = getLoopSubscriptionContainer(productId).querySelector(
      elementId
    );
    if (element) {
      element.classList.add("loop-selected-selling-plan-group");
    }
  }
}

function changeInDeliveryOptionLoop(option) {
  let sellingPlanId = option.target.value;
  let productId = option.target.dataset.productId;
  updateLoopProperties({
    productId,
    sellingPlanId,
  });
  updatePriceInParentElements({ productId });
  updateSellingPlanDescriptionUI({ productId });
  displayDiscountBadge({ productId });
  updatePriceInUI({ productId });
}

// discount badge handlling
function displayDiscountBadge({ productId }) {
  const variant = findSelectedVariantLoop(productId);
  const { selling_plan_groups } = window.loopProps[productId].product;
  if (window && window.loopProps && window.loopPropsUI.displayDiscountBadge) {
    selling_plan_groups.map((spg) => {
      const { selling_plans } = spg;
      let discountList = [];
      selling_plans.map((sp) => {
        const { price_adjustments } = sp;
        let priceAdj = price_adjustments.length ? price_adjustments[0] : {};
        discountList.push({
          value: priceAdj.value,
          value_type: priceAdj.value_type,
          amount:
            priceAdj.value_type === "fixed_amount"
              ? priceAdj.value
              : (Number(variant.price) * priceAdj.value) / 100,
        });
      });
      let selectedDiscount = discountList.reduce((prev, current) =>
        prev.amount > current.amount ? prev : current
      );
      let id = `#loop-discount-badge-${variant.id}-${spg.id}`;
      let element = getLoopSubscriptionContainer(productId).querySelector(id);

      if (
        window.loopProps[productId] &&
        spg.id === window.loopProps[productId].sellingPlanGroupId
      ) {
        let ssp =
          selling_plans.find(
            (sp) => sp.id === Number(window.loopProps[productId].sellingPlanId)
          ) || {};
        selectedDiscount = ssp.price_adjustments[0];
      }
      if (element) {
        let discountText = "";
        if (
          selectedDiscount &&
          selectedDiscount.value_type === "fixed_amount"
        ) {
          discountText = loopFormatMoney(selectedDiscount.value, true);
        } else if (
          selectedDiscount &&
          selectedDiscount.value_type === "percentage"
        ) {
          discountText = `${selectedDiscount.value}%`;
        }

        let text = window?.loopPropsUI?.discountBadgeText || " ";
        let matchText = "{{discount_value}}";
        let discountLabelText = text.replace(`{discount_value}`, discountText);
        element.innerHTML = `${discountLabelText}`;
        if (!selectedDiscount?.value && !Number(selectedDiscount?.value)) {
          element.classList.add("loop-display-none");
        } else {
          element.classList.remove("loop-display-none");
        }
      }
    });
  } else {
    selling_plan_groups.map((spg) => {
      let id = `#loop-discount-badge-${variant.id}-${spg.id}`;
      let element = document.querySelector(id);
      if (element) {
        element.classList.add("loop-display-none");
      }
    });
  }
}

// returns the current selling plan
function calculateCurrentSellingPlanLoop({
  productId,
  availableSellingPlanAllocations,
}) {
  let sellingPlan = {};
  const { sellingPlanId } = window.loopProps[productId];
  for (let i = 0; i < availableSellingPlanAllocations.length; i++) {
    const tempSellingPlan = availableSellingPlanAllocations[i];

    if (
      tempSellingPlan.selling_plan_group_id ===
      window.loopProps[productId].sellingPlanGroupId
    ) {
      if (sellingPlanId) {
        if (Number(tempSellingPlan.selling_plan_id) === Number(sellingPlanId)) {
          sellingPlan = tempSellingPlan;
        }
      } else if (!sellingPlan || !sellingPlan.selling_plan_id) {
        sellingPlan = tempSellingPlan;
      }
    }
  }

  return sellingPlan;
}

// for showing fieldset where selling plans are present
function showSellingPlanFieldset(productId) {
  let loopSubscriptionWidget = getLoopSubscriptionContainer(
    productId
  ).querySelector("#loop-selling-plan-fieldset");
  if (loopSubscriptionWidget) {
    loopSubscriptionWidget.classList.remove(
      "loop-display-none",
      "loop-display-none-by-variant"
    );
  }
}

// for hiding fieldset where selling plans are present
function hideSellingPlanFieldset(productId) {
  let loopSubscriptionWidget = getLoopSubscriptionContainer(
    productId
  ).querySelector("#loop-selling-plan-fieldset");
  if (loopSubscriptionWidget) {
    loopSubscriptionWidget.classList.add(
      "loop-display-none",
      "loop-display-none-by-variant"
    );
  }
}

function showLoopPurchaseOptionsLabel(productId) {
  let elements = getLoopSubscriptionContainer(productId).querySelectorAll(
    ".loop-purchase-options-label"
  );
  if (elements) {
    elements.forEach((element) => {
      if (element) {
        element.classList.remove(
          "loop-display-none",
          "loop-display-none-by-variant"
        );
      }
    });
  }
}

function updateLoopProperties({
  product,
  productId,
  variantId,
  sellingPlanGroupId,
  sellingPlanGroupName,
  sellingPlanId,
}) {
  let loopProperties = getLoopSubscriptionContainer(productId).querySelector(
    "#loop-selling-plan-fieldset"
  );
  if (variantId) {
    if (
      Number(variantId) !== Number(loopProperties.dataset.selectedVariantId)
    ) {
      loopProperties.dataset.sellingPlanGroupId = "";
      loopProperties.dataset.sellingPlanGroupName = "";
      loopProperties.dataset.sellingPlanId = "";
    }
    loopProperties.dataset.selectedVariantId = variantId;
  }

  if (sellingPlanGroupId) {
    loopProperties.dataset.sellingPlanGroupId = sellingPlanGroupId;
  }
  if (sellingPlanGroupName) {
    loopProperties.dataset.sellingPlanGroupName = sellingPlanGroupName;
  }

  if (product) {
    loopProperties.dataset.product = JSON.stringify(product);
  }

  if (sellingPlanId) {
    loopProperties.dataset.sellingPlanId = sellingPlanId;
  } else if (sellingPlanGroupId === "loop-one-time-purchase") {
    loopProperties.dataset.sellingPlanId = "";
    loopProperties.dataset.sellingPlan = {};
    loopProperties.dataset.sellingPlan = {};
  }
  if (!window.loopProps) {
    window.loopProps = {};
    window.loopProps[productId] = { product, productId };
  }
  window.loopProps[productId] = { ...loopProperties.dataset, productId };
  if (loopProperties.dataset && loopProperties.dataset.product) {
    window.loopProps[productId] = {
      ...window.loopProps[productId],
      product: JSON.parse(window.loopProps[productId].product),
    };
  }

  let variant = findSelectedVariantLoop(productId);
  let availableSellingPlanAllocations =
    variant && Array.isArray(variant.selling_plan_allocations)
      ? variant.selling_plan_allocations
      : [];
  window.loopProps[
    productId
  ].availableSellingPlanAllocations = availableSellingPlanAllocations;
  window.loopProps[productId].variant = variant;

  let sellingPlan = calculateCurrentSellingPlanLoop({
    availableSellingPlanAllocations,
    productId,
  });
  let selectedSellingPlanId = sellingPlan.selling_plan_id || "";
  window.loopProps[productId].sellingPlan = sellingPlan;

  let sellingPlanAllocation = availableSellingPlanAllocations.find((aspa) => {
    if (selectedSellingPlanId) {
      if (Number(aspa.selling_plan_id) === Number(selectedSellingPlanId)) {
        return true;
      }
    }
  });
  window.loopProps[productId].sellingPlanAllocation = sellingPlanAllocation;

  const { selling_plan_groups } = window.loopProps[productId].product;
  window.loopProps[productId].sellingPlanDefination = {};
  window.loopProps[productId].sellingPlanPriceAdjustments = [];
  if (selling_plan_groups && Array.isArray(selling_plan_groups)) {
    selling_plan_groups.map((spg) => {
      if (spg.id === window.loopProps[productId].sellingPlanGroupId) {
        const { selling_plans } = spg;
        selling_plans.map((sp) => {
          if (sp.id === Number(window.loopProps[productId].sellingPlanId)) {
            window.loopProps[productId].sellingPlanDefination = sp;
            window.loopProps[productId].sellingPlanPriceAdjustments =
              sp.price_adjustments;
          }
        });
      }
    });
  }

  let sellingPlanRadio = getLoopSubscriptionContainer(productId).querySelector(
    '[name="selling_plan"]'
  );
  if (sellingPlanRadio) {
    sellingPlanRadio.value = selectedSellingPlanId;
  }
  // let sellingPlanRadios = document.querySelectorAll('[name="selling_plan"]');
  // if (sellingPlanRadios && sellingPlanRadios.length) {
  //   for (let i = 0; i < sellingPlanRadios.length; i++) {
  //     let ele = sellingPlanRadios[i];
  //     ele.value = selectedSellingPlanId;
  //   }
  // }
}

function updateCartButtonText({ productId }) {
  let parentElement =
    document.querySelector(`#product_form_${productId}`) || document;
  let oneTimeOrder =
    !window.loopProps ||
    !window.loopProps[productId] ||
    !window.loopProps[productId].sellingPlanGroupId ||
    window.loopProps[productId].sellingPlanGroupId === "loop-one-time-purchase";
  let addToCartButtonSelector = [
    "button[type='submit'][name='add']",
    "button[type='button'][name='add']",
  ];
  let addToCart = null;
  addToCartButtonSelector.map((element) => {
    if (!addToCart) {
      addToCart = parentElement.querySelector(element);
    }
  });

  if (addToCart && addToCart.firstElementChild) {
    if (!oneTimeOrder) {
      addToCart.firstElementChild.innerHTML =
        window?.loopPropsUI?.translationData
          ?.widget_add_to_cart_button_for_subscription ||
        "Add subscription to cart";
    } else {
      addToCart.firstElementChild.innerHTML =
        window?.loopPropsUI?.translationData
          ?.widget_add_to_cart_button_for_one_time_purchase || "Add to cart";
    }

    if (!window.loopProps[productId]["variant"]["available"]) {
      addToCart.firstElementChild.innerHTML =
        window?.loopPropsUI?.translationData?.widget_out_of_stock_text ||
        "Out of Stock";
    }
  } else {
    if (addToCart) {
      if (!oneTimeOrder) {
        addToCart.innerHTML =
          window?.loopPropsUI?.translationData
            ?.widget_add_to_cart_button_for_subscription ||
          "Add subscription to cart";
      } else {
        addToCart.innerHTML =
          window?.loopPropsUI?.translationData
            ?.widget_add_to_cart_button_for_one_time_purchase || "Add to cart";
      }
    }
  }
}

// formats value based on money/money_without_currency filter of shopify
function loopFormatMoney(price, removeEach) {
  let moneyFormat = document.querySelector("#loop-price-money-format")
    .innerText;
  let moneyWithOutCurrency = document.querySelector(
    "#loop-price-money_without_currency-format"
  ).innerText;
  let format = "";

  if (moneyFormat.includes("0.00")) {
    let value = (price / 100).toFixed(2);
    format = moneyFormat.replace("0.00", value);
  } else if (moneyFormat.includes("0,00")) {
    let value = (price / 100).toFixed(2).replace(".", ",");
    format = moneyFormat.replace("0,00", value);
  } else if (moneyFormat.includes("0")) {
    let value = Number(moneyWithOutCurrency.replace("0", price / 100)).toFixed(
      0
    );
    format = moneyFormat.replace("0", value);
  }

  if (removeEach) {
    return format.replace("each", "");
  } else {
    return format;
  }
}

// saved price label in percentage/fixed value
function getSavedPriceLabel(priceAdjustments) {
  if (
    priceAdjustments &&
    Array.isArray(priceAdjustments) &&
    priceAdjustments.length
  ) {
    let pa = priceAdjustments[0];
    if (pa.value_type === "percentage") {
      return `Save ${pa.value}%`;
    } else {
      return `Save ${loopFormatMoney(pa.value, true)}`;
    }
  } else {
    return "";
  }
}

// hide/show of selling plan description
function updateSellingPlanDescriptionUI({ productId }) {
  let descriptionValue = "";
  let variant = findSelectedVariantLoop(productId);
  if (
    window.loopProps &&
    window.loopProps[productId] &&
    window.loopProps[productId].sellingPlanGroupId
  ) {
    const { description } = window.loopProps[productId].sellingPlanDefination;
    descriptionValue = description;
    let descriptionElement = document.querySelector(
      `#loop-selling-plan-description-${variant.id}-${window.loopProps[productId].sellingPlanGroupId}`
    );
    if (descriptionElement) {
      descriptionElement.innerHTML = descriptionValue || "";
    }
    if (!descriptionValue && descriptionElement) {
      descriptionElement.classList.add("loop-display-none");
    } else if (descriptionValue) {
      descriptionElement.classList.remove("loop-display-none");
    }
  }
}

function updatePriceInParentElements({ productId }) {
  if (
    window?.loopProps[productId]?.product?.handle !==
    window.location.pathname.split("/")[
      window.location.pathname.split("/").length - 1
    ]
  ) {
    return;
  }

  let variant = findSelectedVariantLoop(productId);
  let price = 0;

  //selling plan selected
  if (
    window &&
    window.loopProps &&
    window.loopProps[productId].sellingPlanAllocation &&
    window.loopProps[productId].sellingPlanAllocation.price
  ) {
    price = loopFormatMoney(
      window.loopProps[productId].sellingPlanAllocation.price,
      true
    );
  } else {
    // variant's price
    price = loopFormatMoney(variant.price, true);
  }

  loopPriceSelectors.push(`.loop-product-${productId}`);
  loopPriceSelectors.map((selector) => {
    let priceElement = null;
    priceElement = document.querySelector(selector);
    if (priceElement) {
      priceElement.innerHTML = `${price}`;
    }
  });
}

function updatePriceInUI({ productId }) {
  let variant = findSelectedVariantLoop(
    productId,
    window.loopProps[productId].selectedVariantId
  );

  let sellingPlan =
    window.loopProps && window.loopProps[productId]
      ? window.loopProps[productId].sellingPlan
      : {};
  const product = window.loopProps[productId]?.product || {};
  const { selling_plan_groups } = product;
  const { selling_plan_allocations } = variant;
  selling_plan_groups.map((spg) => {
    if (Array.isArray(spg.selling_plans) && spg.selling_plans.length) {
      let firstSellingPlan = spg.selling_plans[0];
      let sellingPlanAllcotion =
        selling_plan_allocations.find(
          (a) => Number(a.selling_plan_id) === Number(firstSellingPlan.id)
        ) || {};
      const {
        selling_plan_group_id,
        per_delivery_price,
      } = sellingPlanAllcotion;
      let element = document.querySelector(
        `#loop-price-${variant.id}-${selling_plan_group_id}`
      );
      if (element) {
        element.innerHTML = loopFormatMoney(per_delivery_price, true);
      }
    }
  });

  if (sellingPlan && sellingPlan.selling_plan_group_id) {
    const { selling_plan_group_id, per_delivery_price } = sellingPlan;
    let element = document.querySelector(
      `#loop-price-${variant.id}-${selling_plan_group_id}`
    );
    if (element) {
      element.innerHTML = loopFormatMoney(per_delivery_price, true);
    }
  }

  let loopOneTimePrice = getLoopSubscriptionContainer(productId).querySelector(
    "#loop-price-one-time"
  );
  if (loopOneTimePrice) {
    loopOneTimePrice.innerHTML = loopFormatMoney(variant.price, true);
  }
}

// listeners are set up here
function setupListeners(productId) {
  const loopContainer = getLoopSubscriptionContainer(productId);

  const loopOneTimeOptions = loopContainer.querySelectorAll(
    ".loop-one-time-purchase-option"
  );
  loopOneTimeOptions.forEach((option) => {
    option.addEventListener("click", clickOnSellingPlanGroupContainer);
  });

  const loopSellingPlanGroupOptions = loopContainer.querySelectorAll(
    ".loop-subscription-group"
  );
  loopSellingPlanGroupOptions.forEach((option) => {
    option.addEventListener("click", clickOnSellingPlanGroupContainer);
  });

  const loopPurchaseOptions = loopContainer.querySelectorAll(
    "input[name=loop_purchase_option]"
  );
  loopPurchaseOptions.forEach((option) => {
    option.addEventListener("click", changeInSellingPlanGroupLoop);
  });

  const loopDeliveryOptions = loopContainer.querySelectorAll(
    ".loop-selling-plan-selector"
  );
  loopDeliveryOptions.forEach((option) => {
    option.addEventListener("change", changeInDeliveryOptionLoop);
  });
}

// initializes the code flow => mutation observer is here
async function getLoopSettingsData(productId) {
  console.log(`initializing loop - ${productId}`);

  let loopProduct = getProductJson(productId);
  if (!window.loopProps) {
    window.loopProps = {};
  }

  if (
    loopProduct?.selling_plan_groups &&
    Array.isArray(loopProduct.selling_plan_groups)
  ) {
    loopProduct.selling_plan_groups = loopProduct.selling_plan_groups.filter(
      (s) => s.app_id === "5284869"
    );
  }

  let sids = loopProduct.selling_plan_groups.map((s) => s.id);

  loopProduct.variants = loopProduct.variants.map((variant) => {
    return {
      ...variant,
      selling_plan_allocations: variant.selling_plan_allocations.filter((s) =>
        sids.includes(s.selling_plan_group_id)
      ),
    };
  });

  window.loopProps[loopProduct.id] = {
    product: loopProduct,
  };

  try {
    let data = {};
    try {
      // DON'T CHANGE THIS NAME => cloud_FrontDistribution_ID
      let response = await fetch(
        `https://d217z8zw4dqir.cloudfront.net/${Shopify.shop}.json`
      );
      data = (await response.json()) || {};
    } catch (e) {
      console.log(e);
    }
    window.loopPropsUI = {
      ...data,
    };

    showSellingPlanFieldset(loopProduct.id);
    showLoopPurchaseOptionsLabel(loopProduct.id);

    let variantId = null;
    const currentPageUrl = document.URL;
    const url = new URL(currentPageUrl);
    let variantIdFromUrl = url.searchParams.get("variant") || "";
    let allVariantId = loopProduct?.variants.map((v) => v.id) || [];

    if (allVariantId.includes(Number(variantIdFromUrl))) {
      variantId = variantIdFromUrl;
    }

    loopInit({
      productId: loopProduct.id,
      product: JSON.parse(JSON.stringify(loopProduct)),
      variantId,
    });

    // to handle hide/show of root loop div
    let loopWidget = getLoopSubscriptionContainer(loopProduct.id);
    if (loopWidget) {
      loopWidget.classList.remove("loop-display-none");
    }
  } catch (e) {
    console.log(e);
  }

  try {
    document.querySelectorAll("form").forEach((form) => {
      let variantElement = form.querySelector('[name="id"]');
      let loopVariantElement = form.querySelector('[name="loop_variant_id"]');
      if (variantElement && loopVariantElement && variantElement.value) {
        loopVariantElement.value = variantElement.value;
      }
      let allVariantsId = loopProduct?.variants.map((v) => v.id);
      if (
        variantElement &&
        variantElement.value &&
        allVariantsId.includes(Number(variantElement.value))
      ) {
        const config = {
          attributes: true,
          childList: true,
          subtree: true,
        };

        const callback = function (mutationsList, observer) {
          let variantId = variantElement?.value || "";
          let loopVariantElementId = loopVariantElement?.value || "";
          if (
            variantId &&
            loopVariantElement &&
            variantId !== loopVariantElementId
          ) {
            loopVariantElement.value = variantId;
            variantChanged({ loopProduct, variantId });
          }
        };

        const observer = new MutationObserver(callback);

        observer.observe(form, config);
      }
    });
  } catch (e) {
    console.log(e);
  }
}

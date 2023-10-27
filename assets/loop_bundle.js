const BUNDLE_LINK_PREFIX = '/a/loop_subscriptions/bundle';
const LOOP_BUNDLE_URL = 'https://api-service.loopwork.co/bundleTransaction/getBundleCartDetails';
const EDIT_SUBTOTAL_CLASS = "totals__subtotal-value";
const getItemsHtml = (item) => {
    return `<p><span class="data-cart-item-selling-plan-name">${item.title || ''} x ${item.quantity || ''}</span></p>`;
}
const getBundleCartItemsTemplate = (bundleItem, index, bundleLink) => {
    return `
		<tr class="cart-item cart-item--bundle" id="CartItem-${bundleItem.bundleId}">
			<td class="cart-item__media">
				<a href="${bundleLink}" class="cart-item__link" aria-hidden="true" tabindex="-1"> </a>
				<img class="cart-item__image" src="${bundleItem.image || ''}" alt="${bundleItem.label}" loading="lazy" width="150" height="150">
			</td>
			<td class="cart-item__details">
				<a href="${bundleLink}" class="cart-item__name h4 break">${bundleItem.label || ''}</a>
				${bundleItem.items.map(item => {	
					return `<p><span class="data-cart-item-selling-plan-name">${item.title || ''} x ${item.quantity || ''}</span></p>`;
				}).join('')}
				<p><span class="data-cart-item-selling-plan-name">${bundleItem.sellingPlan || ''}</span></p>
			</td>
			<td class="cart-item__totals right medium-hide large-up-hide">
				<div class="loading-overlay hidden">
					<div class="loading-overlay__spinner">
						<svg aria-hidden="true" focusable="false" role="presentation" class="spinner" viewBox="0 0 66 66"
							xmlns="http://www.w3.org/2000/svg">
							<circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
						</svg>
					</div>
				</div>
				<div class="cart-item__price-wrapper">
					${ bundleItem.priceWithoutDiscount ? `
						<dl class="cart-item__discounted-prices">
							<dd>
								<s class="cart-item__old-price price price--end">${bundleItem.priceWithoutDiscount}</s>
							</dd>
							<dd class="price price--end">${bundleItem.price}</dd>
						</dl>` : `<span class="price price--end">${bundleItem.price}</span>`
					}
				</div>
			</td>
			<td class="cart-item__quantity">
				<div class="cart-item__quantity-wrapper">
					<span>${bundleItem.quantity}</span>
					<button type="button" onclick="removeBundle('${bundleItem.bundleId}', this )" class="loop-cart-remove button button--tertiary" aria-label="Remove Energy">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" focusable="false" role="presentation" class="icon icon-remove">
							<path d="M14 3h-3.53a3.07 3.07 0 00-.6-1.65C9.44.82 8.8.5 8 .5s-1.44.32-1.87.85A3.06 3.06 0 005.53 3H2a.5.5 0 000 1h1.25v10c0 .28.22.5.5.5h8.5a.5.5 0 00.5-.5V4H14a.5.5 0 000-1zM6.91 1.98c.23-.29.58-.48 1.09-.48s.85.19 1.09.48c.2.24.3.6.36 1.02h-2.9c.05-.42.17-.78.36-1.02zm4.84 11.52h-7.5V4h7.5v9.5z" fill="currentColor"></path>
							<path d="M6.55 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5zM9.45 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5z" fill="currentColor"></path>
						</svg>
					</button>
				</div>
			</td>
			<td class="cart-item__totals right small-hide">
				<div class="loading-overlay hidden">
					<div class="loading-overlay__spinner">
					<svg
						aria-hidden="true"
						focusable="false"
						role="presentation"
						class="spinner"
						viewBox="0 0 66 66"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
					</svg>
					</div>
                </div>
				<div class="cart-item__price-wrapper">
					${ bundleItem.priceWithoutDiscount ? `
						<dl class="cart-item__discounted-prices">
							<dd>
								<s class="cart-item__old-price price price--end">${bundleItem.priceWithoutDiscount}</s>
							</dd>
							<dd class="price price--end">${bundleItem.price}</dd>
						</dl>` : `<span class="price price--end">${bundleItem.price}</span>`
					}
				</div>
			</td>
		</tr>` 
}

const getItemKeysByBundleId = (bundleId) => {
    const cartItems = window.Loop.bundleCartAllItems;
    const data = {
        updates: {}
    };
    for (const item of cartItems) {
        const _bundleId = item?.properties?._bundleId ?? item?.properties?.bundleId;
        if (!_bundleId || _bundleId !== bundleId)
            continue; 
        data.updates[item.key] = 0;
    }
    return data;
}

const removeBundle = async (bundleId, target ) => {
	const cartItems = target.closest('cart-items') || target.closest('cart-drawer-items');
	if( cartItems ){
		cartItems.enableLoading( bundleId );

		const body = JSON.stringify({...{
			sections: cartItems.getSectionsToRender().map((section) => section.section),
			sections_url: window.location.pathname
		}, ...getItemKeysByBundleId(bundleId)});

		fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body } })
			.then((response) => {
				return response.text();
			})
			.then((state) => {
				const parsedState = JSON.parse(state);
				window.Loop.bundleCartAllItems = parsedState.items;

				cartItems.classList.toggle('is-empty', parsedState.item_count === 0);
				const cartDrawerWrapper = document.querySelector('cart-drawer');
				const cartFooter = document.getElementById('main-cart-footer');

				if (cartFooter) cartFooter.classList.toggle('is-empty', parsedState.item_count === 0);
				if (cartDrawerWrapper) cartDrawerWrapper.classList.toggle('is-empty', parsedState.item_count === 0);

				cartItems.getSectionsToRender().forEach((section => {
					const elementToReplace =
						document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
					elementToReplace.innerHTML =
					cartItems.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
				}));

				loopBootstrap();
				
				document.querySelectorAll('.header__icon--cart').forEach((cartLink) => {
					if (cartLink.id != 'cart-icon-bubble') {
						cartLink.innerHTML = cartItems.getSectionInnerHTML(parsedState.sections['cart-icon-bubble'], '.shopify-section');
					}
				});

				cartItems.updateLiveRegions(bundleId, parsedState.item_count);

				if (parsedState.item_count === 0 && cartDrawerWrapper) {
					trapFocus(cartDrawerWrapper.querySelector('.drawer__inner-empty'), cartDrawerWrapper.querySelector('a'))
				} else if (document.querySelector('.cart-item') && cartDrawerWrapper) {
					trapFocus(cartDrawerWrapper, document.querySelector('.cart-item__name'))
				}
				cartItems.disableLoading();
			}).catch(() => {
				cartItems.querySelectorAll('.loading-overlay').forEach((overlay) => overlay.classList.add('hidden'));
				const errors = document.getElementById('cart-errors') || document.getElementById('CartDrawer-CartErrors');
				errors.textContent = window.cartStrings.error;
				cartItems.disableLoading();
			});
	}else{
		const data = getItemKeysByBundleId(bundleId);
		const endpoint = `${window.Shopify.routes.root}cart/update.js`;

		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		window.location.href = window.location.href;
	}
}

const fetchBundleTransactionCartDetails = async (loopBundleGuid) => {
    const endpoint = `${LOOP_BUNDLE_URL}/${loopBundleGuid}`;
    const response = await fetch(endpoint);
    return await response.json();
}

const addExtraDetailsToBundleItems = async (bundleItems) => {
	let totalDiscount = 0;
	let currencySymbol = "";
	let currency = "";
	for (let i = 0; i < bundleItems.length; ++i) {
		const extraDetails = await fetchBundleTransactionCartDetails(
			bundleItems[i].bundleId
		);
		bundleItems[i].label = extraDetails?.label;
		bundleItems[i].image = extraDetails?.image;
		bundleItems[i].sellingPlan = extraDetails?.name;
		let price = bundleItems[i].price;
		bundleItems[i].priceWithoutDiscount = `${extraDetails.currencySymbol
			}${price.toFixed(2)}`;
		if (extraDetails.discountType && extraDetails.discountValue) {
			if (extraDetails.discountType === "PERCENTAGE") {
				const discount = ( Number(extraDetails.discountValue) / 100 ) * price;
				price = price - discount;
				totalDiscount += discount;
			} else {
				price = price - Number(extraDetails.discountValue);
				totalDiscount += Number(extraDetails.discountValue);
			}
		}
		bundleItems[i].price = `${extraDetails.currencySymbol}${
			price.toFixed(2)
		}`;
		bundleItems[i].amount = `${extraDetails.currencySymbol}${
			price.toFixed(2)
		}`;
		bundleItems[i].loopBundleId = extraDetails.loopBundleId;
		currencySymbol = extraDetails.currencySymbol;
		currency = extraDetails.currency;
	}

	removeDiscountFromSubtotalInCart(totalDiscount, currencySymbol, currency);
};

const removeDiscountFromSubtotalInCart = (
	totalDiscount,
	currencySymbol,
	currency
) => {
	if (totalDiscount === 0) return;

	let targetNode = document.querySelector(`.${EDIT_SUBTOTAL_CLASS}`);
	if (targetNode) {
		let innerHtml = targetNode.innerHTML;
		let priceWithoutCurrency = targetNode.innerHTML;
		let addCurrencyOnText = false;
		let addCurrencySymbol = false;

		if (innerHtml.includes(currency)) {
			addCurrencyOnText = true;
			priceWithoutCurrency = innerHtml.replace(currency, "");
		}

		if (priceWithoutCurrency.includes(currencySymbol)) {
			addCurrencySymbol = true;
			priceWithoutCurrency = priceWithoutCurrency.replace(currencySymbol, "");
		}

		priceWithoutCurrency.trim();
		let amount = Number(priceWithoutCurrency) - totalDiscount;
		let newText = `${addCurrencySymbol ? currencySymbol : ""}${amount.toFixed(
			2
		)} ${addCurrencyOnText ? currency : ""}`;
		targetNode.innerHTML = newText;
	}
};

const getBundleItems = (items) => {
    const bundleItemsMap = {};
    for (const item of items) {
        const bundleId = item?.properties?._bundleId ?? item?.properties?.bundleId;
        if (!bundleId)
            continue;
        if (!Object.hasOwn(bundleItemsMap, bundleId)) {
            bundleItemsMap[bundleId] = {
                bundleId,
                quantity: 1,
                price: (Number(item.price) * Number(item.quantity)) / 100,
                amount:(Number(item.price) * Number(item.quantity)) / 100,
                items: [item],
            }
        }
        else {
			bundleItemsMap[bundleId].price +=  (Number(item.price) * Number(item.quantity)) / 100;
            bundleItemsMap[bundleId].amount = bundleItemsMap[bundleId].price;
            bundleItemsMap[bundleId].items.push(item);
        }
    }
    return Object.values(bundleItemsMap);
}

const renderBundleItems = (bundleItems) => {
    let parent = document.querySelectorAll('.cart-items-body');
    for (let i = 0; i < bundleItems.length; ++i) {
        const bundleLink = `${BUNDLE_LINK_PREFIX}/${bundleItems[i].loopBundleId}`;
        const template = getBundleCartItemsTemplate(bundleItems[i], i + 1, bundleLink);
        parent.forEach(ele => {
            ele.innerHTML = `${template} ${ele.innerHTML}`
        });
    }
}

const loopBootstrap = async () => {
    const cartItems = window.Loop.bundleCartAllItems;
    const bundleItems = getBundleItems(cartItems);     
    await addExtraDetailsToBundleItems(bundleItems);
    renderBundleItems(bundleItems);
}

loopBootstrap();
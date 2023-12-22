if (!customElements.get('product-form')) {
	customElements.define('product-form', class ProductForm extends HTMLElement {
		constructor() {
			super();

			this.form = this.querySelector('form');
			this.form.querySelector('[name=id]').disabled = false;
			this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
			this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer') || document.querySelector('cart-items');;
			this.submitButton = this.querySelector('[type="submit"]');
			if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');
			
			if ( typeof CartItems !== 'undefined' && this.cart instanceof CartItems ) this.dataset.cartType = 'page';
			
		}	

		onSubmitHandler(evt) {
			evt.preventDefault();
			if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

			this.handleErrorMessage();

			this.submitButton.setAttribute('aria-disabled', true);
			this.submitButton.classList.add('loading');
			this.querySelector('.loading-overlay__spinner').classList.remove('hidden');

			const config = fetchConfig('javascript');
			config.headers['X-Requested-With'] = 'XMLHttpRequest';
			delete config.headers['Content-Type'];

			const formData = new FormData(this.form);
			if (this.dataset.cartType != 'page') {
				formData.append('sections', this.cart.getSectionsToRender().map((section) => section.id));
				formData.append('sections_url', window.location.pathname);
				this.cart.setActiveElement(document.activeElement);
			}
			config.body = formData;

			fetch(`${routes.cart_add_url}`, config)
				.then((response) => response.json())
				.then((response) => {
					if (response.status) {
						this.handleErrorMessage(response.description);

						const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
						if (!soldOutMessage) return;
						this.submitButton.setAttribute('aria-disabled', true);
						this.submitButton.querySelectorAll('span').forEach((span) => {
							span.classList.add('hidden');
						});
						soldOutMessage.classList.remove('hidden');
						this.error = true;
						return;
					} else if (this.dataset.cartType == 'page') {
						window.location = window.routes.cart_url;
						console.log("asd3 cartpage", response)
						return;
					}

					this.error = false;

					const addedMessage = this.submitButton.querySelector('.added-message');
					const atcMessage = this.submitButton.querySelector('.add-to-cart-message');
					if (addedMessage && atcMessage) {
						this.submitButton.querySelectorAll('span').forEach((span) => {
							span.classList.add('hidden');
						});
						addedMessage.classList.remove('hidden');
						setTimeout(() => {
							this.submitButton.querySelectorAll('span').forEach((span) => {
								span.classList.add('hidden');
							});
							atcMessage.classList.remove('hidden');
						}, 1500);
					}
					
					const quickAddModal = this.closest('quick-add-modal');
					if (quickAddModal) {
						document.body.addEventListener('modalClosed', () => {
							setTimeout(() => { this.cart.renderContents(response) });
						}, { once: true });
						quickAddModal.hide(true);
					} else {
						this.cart.renderContents(response);
					}

					fetch(`${routes.cart_url}.js`, {
						method: 'GET'
					  })
					  .then((response) => response.json())
					  .then((response) => {
						const ifExists = response.items.find((element) => element.id === window.freeGiftId)

						if (response.total_price >= window.freeGiftGoal && !ifExists) {
							this.addGift(window.freeGiftId)
						}
					  })
					  .catch((error) => {
						console.error('Error:', error);
					  });

				})
				.catch((e) => {
					console.error(e);
				})
				.finally(() => {
					this.submitButton.classList.remove('loading');
					if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
					if (!this.error) this.submitButton.removeAttribute('aria-disabled');
					this.querySelector('.loading-overlay__spinner').classList.add('hidden');
				});
		}

		addGift(giftId) {
			const config = fetchConfig('javascript');
			config.headers['X-Requested-With'] = 'XMLHttpRequest';
			delete config.headers['Content-Type'];
			
			const formData = new FormData();
			formData.append('id', giftId);
			formData.append('quantity', 1);
			formData.append('sections', this.cart.getSectionsToRender().map((section) => section.id));
			formData.append('sections_url', window.location.pathname);
			config.body = formData;
			
			fetch(`${routes.cart_add_url}`, config)
			.then((response) => response.json())
			.then((response) => {
				this.cart.renderContents(response);
			})
			.catch((e) => {
				console.error(e);
			})
		}

		handleErrorMessage(errorMessage = false) {
			this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
			if (!this.errorMessageWrapper) return;
			this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

			this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

			if (errorMessage) {
				this.errorMessage.textContent = errorMessage;
			}
		}
	});
}
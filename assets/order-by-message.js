const ArraymonthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
    }
  
  function getDaySuffix(n) {
    if (n >= 11 && n <= 13) {
      return 'th';
    }
    switch (n % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }
  
  function formatDate(date) {
    const day = date.getDate();
    return ArraymonthNames[date.getMonth()] + ' ' + day + getDaySuffix(day);
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const deliveryEl = document.querySelector('.product-form__order-by');
  
    if (deliveryEl) {

        const dateNow = new Date();
        
        const getMessage = deliveryEl.dataset.message;
        const getMaxDate = dateNow.addDays(parseInt(deliveryEl.dataset.maxDays));
        const getMinDate = dateNow.addDays(parseInt(deliveryEl.dataset.minDays));

        const maxDate = formatDate(getMaxDate);
        const minDate = formatDate(getMinDate);

        if (!isNaN(getMaxDate.getDate())) {
            deliveryEl.innerHTML = `
            <span class="product-form__order-by__text">
                ${getMessage} <span class="pdp-estimated-delivery__date">${minDate} - ${maxDate}</span>
            </span>
            `;
          }
    }
  });
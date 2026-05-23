(() => {
  const status = document.getElementById('checkout-status');

  if (status) {
    status.textContent = 'Secure payment gateway available in the app checkout';
  }

  window.ShoesLuxuryCheckout = {
    openAppCheckout() {
      window.location.href = '/checkout';
    },
  };
})();
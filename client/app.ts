// Core imports
import { initCookieConsentBanner } from "./modules/cookie-consent.js";
import { CartManager } from "./modules/cart-manager.js";
import { showToast, showConfirmModal } from "./modules/utils.js";

// Feature modules
import { applyProductConfiguration, setupAddToCartButtons, setupCartItemHandlers, applyStoreConfiguration } from "./modules/products.js";
import { renderCheckoutSummary } from "./modules/checkout-summary.js";
import { showOrderConfirmationModal } from "./modules/order-confirmation.js";
import { setupPaymentMethodHandler } from "./modules/payment.js";
import { setupLegalPageNavigation } from "./modules/legal-pages.js";
import {
  validatePhone,
  formatPhoneInput,
  validateParcelLockerCode,
  formatParcelLockerCodeInput,
  validateOrderNotes,
  handleNotesInput,
} from "./modules/form-validation.js";
import {
  getFormElements,
  buildOrderData,
  submitOrder,
  setSubmitButtonLoading,
  setCheckoutMessage,
} from "./modules/form-handlers.js";
import { setupLazyParcelLoaderLoading } from "./modules/parcel-loaders.js";

const cartManager = new CartManager();

window.addEventListener("DOMContentLoaded", () => {
  initCookieConsentBanner();
  applyStoreConfiguration();
  applyProductConfiguration();
  setupLegalPageNavigation();
  setupAddToCartButtons(cartManager);
  setupCartItemHandlers(cartManager);
  renderCheckoutSummary(cartManager);

  const {
    checkoutForm,
    submitButton,
    checkoutMessage,
    paymentMethod,
    paymentInstructions,
    customerPhone,
    customerNotes,
    parcelLockerCode,
  } = getFormElements();

  // Payment method
  setupPaymentMethodHandler(paymentMethod, paymentInstructions);

  // Parcel locker autocomplete with lazy loading
  let parcelLockers: Array<{ code: string }> = [];
  const parcelSearchInput = document.getElementById("parcelSearchQuery") as HTMLInputElement | null;
  const parcelSearchWrapper = parcelSearchInput?.parentElement ?? null;
  if (parcelSearchInput && parcelSearchWrapper && parcelLockerCode) {
    parcelSearchWrapper.style.position = "relative";
    const searchBox = document.createElement("div");
    searchBox.className = "autocomplete-box";
    parcelSearchWrapper.appendChild(searchBox);
    setupLazyParcelLoaderLoading(parcelSearchInput, parcelLockerCode, searchBox, (lockers) => {
      parcelLockers = lockers;
    });
  }

  // Clear cart button (event delegation — button may be re-created on each render)
  document.getElementById("checkoutSummary")?.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.id === "clearCartBtn" || target.closest("#clearCartBtn")) {
      void (async () => {
        const confirmed = await showConfirmModal("Wyczyść koszyk", "Na pewno chcesz wyczyścić cały koszyk?");
        if (confirmed) {
          cartManager.clear();
          renderCheckoutSummary(cartManager);
          showToast("Koszyk został wyczyszczony.");
        }
      })();
    }
  });

  if (!checkoutForm || !customerPhone || !parcelLockerCode) {
    console.warn("Missing critical form elements");
    return;
  }

  // Validation listeners
  customerPhone.addEventListener("input", formatPhoneInput);
  customerPhone.addEventListener("blur", () => validatePhone(customerPhone, true));

  parcelLockerCode.addEventListener("input", formatParcelLockerCodeInput);
  parcelLockerCode.addEventListener("blur", () => validateParcelLockerCode(parcelLockerCode, parcelLockers, true));

  customerNotes?.addEventListener("input", handleNotesInput);

  // Form submission
  checkoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (cartManager.isEmpty()) {
      showToast("Zamówienie nie zawiera wybranego produktu. Dodaj produkty przed złożeniem zamówienia.");
      document.getElementById("checkoutSummary")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const phoneValid = validatePhone(customerPhone, true);
    const parcelValid = validateParcelLockerCode(parcelLockerCode, parcelLockers, true);
    const notesValid = !customerNotes || validateOrderNotes(customerNotes, true);

    if (!phoneValid || !parcelValid || !notesValid) {
      setCheckoutMessage(checkoutMessage, "Popraw zaznaczone pola formularza.");
      showToast("Popraw zaznaczone pola formularza.");
      if (!phoneValid) customerPhone.focus();
      else if (!parcelValid) parcelLockerCode.focus();
      else customerNotes?.focus();
      return;
    }

    setSubmitButtonLoading(submitButton, true);
    setCheckoutMessage(checkoutMessage, "Wysyłanie zamówienia...");

    const response = await submitOrder(
      buildOrderData(
        cartManager,
        customerPhone.value.replace(/\D/g, ""),
        parcelLockerCode.value,
        paymentMethod?.value ?? "przelew",
        customerNotes?.value.trim() ?? ""
      )
    );

    setSubmitButtonLoading(submitButton, false);

    if (response) {
      setCheckoutMessage(checkoutMessage, "");
      showOrderConfirmationModal(response, cartManager);
      cartManager.clear();
      renderCheckoutSummary(cartManager);
    } else {
      setCheckoutMessage(checkoutMessage, "Błąd podczas wysyłania zamówienia.");
    }
  });
});


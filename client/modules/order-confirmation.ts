import type { CartItem, OrderConfirmationData } from "../types.js";
import { CartManager } from "./cart-manager.js";

/**
 * Show order confirmation modal after successful order submission
 */
export function showOrderConfirmationModal(
  data: OrderConfirmationData,
  cartManager: CartManager
): void {
  // Remove existing modal
  const existing = document.getElementById("order-confirm-modal");
  if (existing) existing.remove();

  // Create overlay
  const overlay = document.createElement("div");
  overlay.id = "order-confirm-modal";
  overlay.className = "order-confirm-modal-overlay";

  // Create modal
  const modal = document.createElement("div");
  modal.className = "order-confirm-modal";

  // Create body
  const body = document.createElement("div");
  body.className = "order-confirm-modal-body";

  // Extract order number
  let orderNum = (data.orderRef || data.orderId || "").toString();
  if (orderNum.includes("-")) orderNum = orderNum.split("-").pop() || orderNum;

  // Calculate delivery
  const productsTotal = cartManager.getTotalPrice();
  const deliveryInfo = cartManager.getDeliveryInfo();
  const totalWithDelivery = productsTotal + deliveryInfo.finalCost;

  // Format payment details
  let paymentDetailsHTML = "";
  if (data.paymentTarget) {
    if (data.paymentTarget.includes("BLIK")) {
      const blikPhone = data.paymentTarget
        .replace(/^BLIK na telefon:\s*/i, "")
        .trim();
      paymentDetailsHTML = `
        <div class="order-confirm-modal-summary-row"><b>Odbiorca:</b><br><span class="order-confirm-modal-payment">Galaretkarnia</span></div>
        <div class="order-confirm-modal-summary-row"><b>Numer telefonu:</b><br><span class="order-confirm-modal-payment">${blikPhone}</span></div>
      `;
    } else if (data.paymentTarget.includes("Galaretkarnia")) {
      const accountNum = data.paymentTarget
        .replace(/ \(Galaretkarnia\)/, "")
        .trim();
      paymentDetailsHTML = `
        <div class="order-confirm-modal-summary-row"><b>Odbiorca:</b><br><span class="order-confirm-modal-payment">Galaretkarnia</span></div>
        <div class="order-confirm-modal-summary-row"><b>Numer konta:</b><br><span class="order-confirm-modal-payment">${accountNum}</span></div>
      `;
    } else {
      paymentDetailsHTML = `<div class="order-confirm-modal-summary-row"><b>Dane do płatności:</b><br><span class="order-confirm-modal-payment">${data.paymentTarget}</span></div>`;
    }
  }

  body.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:12px;margin-bottom:18px;">
      <span style="font-size:2.7em;line-height:1;">🎉</span>
      <div class="order-confirm-modal-thankyou">Zamówienie przyjęte!</div>
      <div style="font-size:1.13em;color:#b30000;font-weight:700;">Dziękujemy za zakupy w <b>Galaretkarnia.pl</b></div>
    </div>
    <div class="order-confirm-modal-summary-row"><b>Numer zamówienia:</b><br><span class="order-confirm-modal-ref">${orderNum}</span></div>
    <div class="order-confirm-modal-summary-row"><b>Do zapłaty:</b><br><span class="order-confirm-modal-total">${totalWithDelivery} zł</span></div>
    <div class="order-confirm-modal-summary-row"><b>Tytuł przelewu:</b><br><span class="order-confirm-modal-transfer">Zamówienie ${orderNum}</span></div>
    ${paymentDetailsHTML}
    <div class="order-confirm-modal-info">Zamówienie zostanie zrealizowane po zaksięgowaniu wpłaty.</div>
  `;
  modal.appendChild(body);

  // Add products list
  const productsList = document.createElement("div");
  productsList.className = "checkout-summary-products";
  cartManager.getAll().forEach((item: CartItem) => {
    const row = document.createElement("div");
    row.className = "checkout-summary-product-row";
    let qtyLabel = "sztuk";
    if (item.qty === 1) qtyLabel = "sztuka";
    else if (item.qty >= 2 && item.qty <= 4) qtyLabel = "sztuki";
    let imgHtml = "";
    if (item.image) {
      imgHtml = `<img src="${item.image}" alt="${item.name}" class="checkout-summary-product-img">`;
    }
    row.innerHTML = `${imgHtml}<span class="checkout-summary-product-name">${item.name}</span> — <span class="checkout-summary-product-qty">${item.qty} ${qtyLabel}</span> × <span class="checkout-summary-product-price">${item.price} zł</span>`;
    productsList.appendChild(row);
  });
  modal.appendChild(productsList);

  // Add actions
  const actions = document.createElement("div");
  actions.className = "order-confirm-modal-actions";
  const okBtn = document.createElement("button");
  okBtn.className = "browse-products-btn clear-cart-btn";
  okBtn.textContent = "OK";

  const closeModal = () => {
    overlay.remove();
    document.removeEventListener("keydown", escHandler);

    // Reset form
    const form = document.getElementById("checkoutForm") as HTMLFormElement | null;
    if (form) form.reset();

    // Clear messages
    const msg = document.getElementById("checkoutMessage");
    if (msg) msg.innerHTML = "";
  };

  function escHandler(ev: KeyboardEvent) {
    if (ev.key === "Escape") {
      closeModal();
    }
  }

  okBtn.addEventListener("click", closeModal);
  actions.appendChild(okBtn);
  modal.appendChild(actions);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  document.addEventListener("keydown", escHandler);
}

import { CartManager } from "./cart-manager.js";

/**
 * Render checkout summary including product list, totals, and delivery info
 */
export function renderCheckoutSummary(cartManager: CartManager): void {
  const summaryEl = document.getElementById("checkoutSummary");
  if (!summaryEl) return;
  summaryEl.innerHTML = "";

  const cart = cartManager.getAll();

  // Empty cart state
  if (cart.length === 0) {
    const emptyMsg = document.createElement("div");
    emptyMsg.className = "checkout-summary-empty";
    emptyMsg.innerHTML = `
      <div class="emoji">🛒</div>
      <div class="message">Zamówienie nie zawiera wybranego produktu.</div>
      <div class="submessage">Dodaj produkty przed złożeniem zamówienia.</div>
    `;

    const browseBtn = document.createElement("button");
    browseBtn.type = "button";
    browseBtn.textContent = "Przeglądaj produkty";
    browseBtn.className = "browse-products-btn";
    browseBtn.setAttribute("data-testid", "btn-browse-offer");
    browseBtn.addEventListener("click", () => {
      const section =
        document.getElementById("products") ||
        document.querySelector(".products-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    });
    emptyMsg.appendChild(browseBtn);
    summaryEl.appendChild(emptyMsg);

    // Hide clear cart button
    const clearBtn = document.getElementById("clearCartBtn") as
      | HTMLButtonElement
      | null;
    if (clearBtn) clearBtn.style.display = "none";
    return;
  }

  // Non-empty cart
  const productsTotal = cartManager.getTotalPrice();
  const deliveryInfo = cartManager.getDeliveryInfo();
  const totalWithDelivery = productsTotal + deliveryInfo.finalCost;
  const itemsCount = cartManager.getTotalItemsCount();
  const parcelInfo =
    deliveryInfo.numberOfParcels > 1
      ? `${deliveryInfo.numberOfParcels} paczki`
      : "1 paczka";

  // Product list
  const productsList = document.createElement("div");
  productsList.className = "checkout-summary-products";
  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "checkout-summary-product-row";

    let qtyLabel = "sztuk";
    if (item.qty === 1) qtyLabel = "sztuka";
    else if (item.qty >= 2 && item.qty <= 4) qtyLabel = "sztuki";

    let imgHtml = "";
    if (item.image) {
      imgHtml = `<img src="${item.image}" alt="${item.name}" class="checkout-summary-product-img">`;
    }

    row.innerHTML = `
      <div class="checkout-summary-product-main">
        ${imgHtml}
        <div class="checkout-summary-product-meta">
          <span class="checkout-summary-product-name">${item.name}</span>
          <span class="checkout-summary-product-unit">${item.qty} ${qtyLabel}. × ${item.price} zł</span>
        </div>
        <div class="checkout-summary-product-actions">
          <button class="cart-btn cart-btn-decrease" data-product-name="${item.name}" title="Zmniejsz ilość">-</button>
          <span class="checkout-summary-product-qty">${item.qty}</span>
          <button class="cart-btn cart-btn-increase" data-product-name="${item.name}" title="Zwiększ ilość">+</button>
          <button class="cart-btn cart-btn-remove" data-product-name="${item.name}" title="Usuń produkt">×</button>
        </div>
      </div>
      <div class="checkout-summary-product-total">Razem: ${item.qty * item.price} zł</div>
    `;
    productsList.appendChild(row);
  });
  summaryEl.appendChild(productsList);

  // Show clear cart button
  const clearBtnShow = document.getElementById("clearCartBtn") as
    | HTMLButtonElement
    | null;
  if (clearBtnShow) clearBtnShow.style.display = "";

  // Separator
  const hr1 = document.createElement("hr");
  hr1.className = "checkout-summary-hr";
  summaryEl.appendChild(hr1);

  // Products total
  const productsLine = document.createElement("div");
    productsLine.innerHTML = `<strong>Produkty w zamówieniu:</strong> ${productsTotal} zł`;
  productsLine.className = "checkout-summary-total-line";
  summaryEl.appendChild(productsLine);

  // Delivery cost
  const deliveryCostLine = document.createElement("div");
  deliveryCostLine.className = "checkout-summary-delivery-cost-line";
  if (deliveryInfo.finalCost === 0) {
    deliveryCostLine.innerHTML = `<strong>Dostawa:</strong> <span class="checkout-summary-gratis">GRATIS!</span>`;
  } else {
    deliveryCostLine.innerHTML = `<strong>Dostawa:</strong> ${deliveryInfo.finalCost} zł`;
  }
  summaryEl.appendChild(deliveryCostLine);

  // Delivery details
  const deliveryLine = document.createElement("div");
  deliveryLine.innerHTML = `<strong>Szczegóły dostawy:</strong> ${parcelInfo}, ${itemsCount} szt.`;
  deliveryLine.className = "checkout-summary-delivery-line";
  summaryEl.appendChild(deliveryLine);

  // Separator
  const hr2 = document.createElement("hr");
  hr2.className = "checkout-summary-hr";
  summaryEl.appendChild(hr2);

  // Final total
  const totalLine = document.createElement("div");
  totalLine.innerHTML = `<span class="checkout-summary-final-label">Do zapłaty:</span> <span class="checkout-summary-final">${totalWithDelivery} zł</span>`;
  totalLine.className = "checkout-summary-final-line";
  summaryEl.appendChild(totalLine);

  // Clear cart button
  const clearBtnEl = document.getElementById("clearCartBtn") as
    | HTMLButtonElement
    | null;
  if (!clearBtnEl) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "clearCartBtn";
    btn.className = "browse-products-btn clear-cart-btn";
    btn.setAttribute("data-testid", "btn-clear-cart");
      btn.textContent = "Wyczyść zamówienie";

    const actionsRow = document.createElement("div");
    actionsRow.className = "checkout-actions-row";
    actionsRow.appendChild(btn);
    summaryEl.appendChild(actionsRow);

    updateClearButtonState(btn, cart.length);
  } else {
    updateClearButtonState(clearBtnEl, cart.length);
  }
}

function updateClearButtonState(btn: HTMLButtonElement, cartLength: number) {
  if (cartLength === 0) {
    btn.disabled = true;
    btn.classList.add("btn-disabled");
      btn.title = "Zamówienie jest puste";
  } else {
    btn.disabled = false;
    btn.classList.remove("btn-disabled");
      btn.title = "Usuń wszystkie produkty z zamówienia";
  }
}

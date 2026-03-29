// Cart module
export function renderCartList(cart: any[], cartList: HTMLElement) {
  cartList.innerHTML = '';
  if (!cart || cart.length === 0) {
    cartList.innerHTML = '<p>Twój koszyk jest pusty.</p>';
    return;
  }
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <span class="cart-item-name"><strong>${item.name}</strong></span>
      <div class="cart-item-controls">
        <button class="cart-btn cart-btn-decrease" data-action="decrease" data-id="${item.id}" aria-label="Zmniejsz ilość">-</button>
        <span class="cart-item-qty">${item.qty}</span>
        <button class="cart-btn cart-btn-increase" data-action="increase" data-id="${item.id}" aria-label="Zwiększ ilość">+</button>
        <button class="cart-btn cart-btn-remove" data-action="remove" data-id="${item.id}" aria-label="Usuń z koszyka">×</button>
        <span class="cart-item-subtotal">= ${item.price * item.qty} zł</span>
      </div>
    `;
    cartList.appendChild(div);
  });
}

export function showCartError(message: string, container: HTMLElement) {
  container.innerHTML = `<div class="cart-error">${message}</div>`;
}
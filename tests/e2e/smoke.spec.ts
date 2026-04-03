import { expect, test } from '@playwright/test';

test.describe('Galaretkarnia smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    const rejectCookiesBtn = page.getByRole('button', { name: 'Odrzuć opcjonalne' });
    if (await rejectCookiesBtn.isVisible()) {
      await rejectCookiesBtn.click();
    }
  });

  test('home page loads with key sections', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Tradycyjna galaretka');
    await expect(page.getByTestId('section-products')).toBeVisible();
    await expect(page.getByTestId('order-form')).toBeVisible();
    await expect(page.getByTestId('select-payment-method')).toBeVisible();
  });

  test('can add product to cart summary', async ({ page }) => {
    await page.getByTestId('btn-add-to-cart').first().click();
    const summary = page.getByTestId('checkout-summary-list');

    await expect(summary).toBeVisible();
    await expect(summary).toContainText('Galaretka');
    await expect(summary).toContainText('Wyczyść koszyk');
  });

  test('shows warning when submitting empty cart', async ({ page }) => {
    await page.getByTestId('btn-submit-order').click();

    const toast = page.locator('#toastMessage');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Zamówienie nie zawiera wybranego produktu.');
    await expect(page.locator('#order-confirm-modal')).toHaveCount(0);
  });

  test('updates payment instructions when method changes', async ({ page }) => {
    const paymentSelect = page.getByTestId('select-payment-method');
    const paymentInstructions = page.getByTestId('msg-payment-instructions');

    await expect(paymentInstructions).toContainText('Numer konta:');
    await paymentSelect.selectOption('blik');
    await expect(paymentInstructions).toContainText('Numer telefonu:');
    await paymentSelect.selectOption('bank_transfer');
    await expect(paymentInstructions).toContainText('Numer konta:');
  });

  test('keeps cart items after page reload', async ({ page }) => {
    await page.getByTestId('btn-add-to-cart').first().click();
    await expect(page.getByTestId('checkout-summary-list')).toContainText('Galaretka drobiowa');

    await page.reload();
    await expect(page.getByTestId('checkout-summary-list')).toContainText('Galaretka drobiowa');
  });

  test('validates phone and parcel locker fields', async ({ page }) => {
    const phoneInput = page.getByTestId('input-customer-phone');
    const phoneError = page.getByTestId('msg-phone-error');
    const lockerInput = page.getByTestId('input-parcel-locker-code');
    const lockerError = page.getByTestId('msg-locker-error');

    await phoneInput.fill('123');
    await phoneInput.blur();
    await expect(phoneError).toContainText('Numer telefonu musi mieć 9 cyfr.');

    await phoneInput.fill('123456789');
    await phoneInput.blur();
    await expect(phoneError).toContainText('Numer powinien zaczynać się od 5, 6, 7 lub 8.');

    await lockerInput.fill('A1');
    await lockerInput.blur();
    await expect(lockerError).toContainText('Kod paczkomatu musi mieć min. 6 znaków');
  });

  test('formats phone input and limits to 9 digits', async ({ page }) => {
    const phoneInput = page.getByTestId('input-customer-phone');

    await phoneInput.fill('5a1 2-3x4_56789');
    await expect(phoneInput).toHaveValue('512 345 678');
  });

  test('normalizes parcel locker code to uppercase without spaces', async ({ page }) => {
    const lockerInput = page.getByTestId('input-parcel-locker-code');

    await lockerInput.fill(' waw 01a ');
    await expect(lockerInput).toHaveValue('WAW01A');
  });

  test('validates notes restrictions and counter', async ({ page }) => {
    const notesInput = page.getByTestId('input-customer-notes');
    const notesError = page.getByTestId('msg-notes-error');
    const notesCounter = page.getByTestId('msg-notes-counter');

    await notesInput.fill('abcde');
    await expect(notesCounter).toHaveText('5 / 300');

    await notesInput.fill('<test>');
    await notesInput.blur();
    await expect(notesError).toContainText('Uwagi nie mogą zawierać znaków < ani >.');
  });

  test('legal pages are reachable', async ({ page }) => {
    await page.goto('/terms.html');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Regulamin');

    await page.goto('/privacy.html');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Polityka prywatności');
  });

  test('resets form and cart after closing order confirmation modal', async ({ page }) => {
    const parcelResponse = await page.request.get('/parcelLockers.json');
    expect(parcelResponse.ok()).toBeTruthy();
    const parcelLockers = (await parcelResponse.json()) as Array<{ n?: string }>;
    const lockerCode = parcelLockers.find((locker) => typeof locker.n === 'string' && locker.n.trim().length >= 6)?.n;
    expect(lockerCode).toBeTruthy();

    await page.getByTestId('btn-add-to-cart').first().click();
    await page.getByTestId('input-customer-phone').fill('512345678');
    await page.getByTestId('input-parcel-locker-code').fill(String(lockerCode));
    await page.getByTestId('input-customer-notes').fill(`E2E reset check ${Date.now()}`);
    await page.getByTestId('btn-submit-order').click();

    const modal = page.locator('#order-confirm-modal');
    await expect(modal).toBeVisible({ timeout: 15000 });
    await modal.getByRole('button', { name: 'OK' }).click();
    await expect(modal).toHaveCount(0);

    await expect(page.getByTestId('input-customer-phone')).toHaveValue('');
    await expect(page.getByTestId('input-parcel-locker-code')).toHaveValue('');
    await expect(page.getByTestId('input-customer-notes')).toHaveValue('');
    await expect(page.getByTestId('checkout-summary-list')).toContainText('Zamówienie nie zawiera wybranego produktu.');
  });
});

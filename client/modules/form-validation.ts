/**
 * Form validation functions
 */

export interface ValidationRules {
  phone?: HTMLInputElement;
  parcelLockerCode?: HTMLInputElement;
  notes?: HTMLTextAreaElement;
  parcelLockers?: Array<{ code: string }>;
}

export interface ValidationErrors {
  phone?: string;
  parcelLockerCode?: string;
  notes?: string;
}

const NOTES_MAX_LENGTH = 300;
const NOTES_WARNING_THRESHOLD = 260;

/**
 * Validate phone number (9 digits, starts with 5-8)
 */
export function validatePhone(
  input: HTMLInputElement | null,
  showError: boolean = true
): boolean {
  if (!input) return false;

  const raw = input.value.replace(/\D/g, "");
  let msg = "";

  if (raw.length === 0) {
    msg = "Podaj numer telefonu.";
  } else if (raw.length < 9) {
    msg = "Numer telefonu musi mieć 9 cyfr.";
  } else if (!/^[5-8]/.test(raw)) {
    msg = "Numer powinien zaczynać się od 5, 6, 7 lub 8.";
  }

  if (showError) {
    const phoneError = document.getElementById("phoneError");
    if (phoneError) phoneError.textContent = msg;
  }

  return msg === "";
}

/**
 * Format phone input (000 000 000)
 */
export function formatPhoneInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, "");
  if (value.length > 9) value = value.slice(0, 9);

  let formatted = value;
  if (value.length > 6) {
    formatted = value.slice(0, 3) + " " + value.slice(3, 6) + " " + value.slice(6);
  } else if (value.length > 3) {
    formatted = value.slice(0, 3) + " " + value.slice(3);
  }
  input.value = formatted;
  validatePhone(input, true);
}

/**
 * Validate parcel locker code
 */
export function validateParcelLockerCode(
  input: HTMLInputElement | null,
  parcelLockers: Array<{ code: string }>,
  showError: boolean = true
): boolean {
  if (!input) return false;

  const value = input.value.trim().toUpperCase();
  let msg = "";

  if (value.length === 0) {
    msg = "Podaj kod paczkomatu.";
  } else if (!/^[A-Z0-9]{6,}$/.test(value)) {
    msg = "Kod paczkomatu musi mieć min. 6 znaków (litery i cyfry).";
  } else if (
    parcelLockers.length > 0 &&
    !parcelLockers.some((l) => l.code === value)
  ) {
    msg = "Podany kod paczkomatu nie istnieje. Wybierz poprawny paczkomat z listy.";
  }

  if (showError) {
    const lockerError = document.getElementById("lockerError");
    if (lockerError) lockerError.textContent = msg;
  }

  return msg === "";
}

/**
 * Format parcel locker code input (uppercase, no spaces)
 */
export function formatParcelLockerCodeInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  input.value = input.value.toUpperCase().replace(/\s+/g, "");
}

/**
 * Validate order notes
 */
export function validateOrderNotes(
  input: HTMLTextAreaElement | null,
  showError: boolean = true
): boolean {
  if (!input) return false;

  const value = input.value;
  let msg = "";

  if (value.length > NOTES_MAX_LENGTH) {
    msg = `Uwagi mogą mieć maksymalnie ${NOTES_MAX_LENGTH} znaków.`;
  } else if (/<|>/.test(value)) {
    msg = "Uwagi nie mogą zawierać znaków < ani >.";
  } else if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value)) {
    msg = "Uwagi zawierają niedozwolone znaki.";
  }

  if (showError) {
    const notesError = document.getElementById("notesError");
    if (notesError) notesError.textContent = msg;
  }

  return msg === "";
}

/**
 * Update notes counter (visual feedback)
 */
export function updateNotesCounter(input: HTMLTextAreaElement | null): void {
  if (!input) return;

  const notesCounter = document.getElementById("notesCounter");
  if (!notesCounter) return;

  const currentLength = input.value.length;
  notesCounter.textContent = `${currentLength} / ${NOTES_MAX_LENGTH}`;
  notesCounter.classList.toggle(
    "is-warning",
    currentLength >= NOTES_WARNING_THRESHOLD && currentLength < NOTES_MAX_LENGTH
  );
  notesCounter.classList.toggle("is-limit", currentLength >= NOTES_MAX_LENGTH);
}

/**
 * Handle notes input with truncation
 */
export function handleNotesInput(event: Event): void {
  const input = event.target as HTMLTextAreaElement;
  if (input.value.length > NOTES_MAX_LENGTH) {
    input.value = input.value.slice(0, NOTES_MAX_LENGTH);
  }
  updateNotesCounter(input);
  validateOrderNotes(input, true);
}

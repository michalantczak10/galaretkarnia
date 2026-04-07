import type { ParcelLocker } from "../types.js";
import { setupParcelAutocomplete } from "./autocomplete.js";
import { showCartError } from "./cart.js";

/**
 * Load parcel lockers from JSON and setup autocomplete
 */
export async function loadAndSetupParcelLockers(
  searchInput: HTMLInputElement | null,
  codeInput: HTMLInputElement | null,
  searchBox: HTMLElement
): Promise<ParcelLocker[]> {
  if (!searchInput || !codeInput) {
    console.warn("Parcel locker inputs not found");
    return [];
  }

  try {
    const response = await fetch("parcelLockers.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    // Map from external format to ParcelLocker
    const parcelLockers: ParcelLocker[] = data.map(
      (locker: any) => ({
        code: locker.n,
        name: `${locker.c}${locker.e ? ", " + locker.e : ""}${locker.b ? " " + locker.b : ""}`
          .trim(),
        address: locker.d || "",
      })
    );

    // Setup autocomplete
    setupParcelAutocomplete(parcelLockers, searchInput, codeInput, searchBox);

    return parcelLockers;
  } catch (error) {
    console.warn("Failed to load parcel lockers:", error);
    showCartError("Nie udało się pobrać listy paczkomatów.", searchBox);
    return [];
  }
}

/**
 * Setup lazy loading of parcel lockers on first interaction
 */
export function setupLazyParcelLoaderLoading(
  searchInput: HTMLInputElement | null,
  codeInput: HTMLInputElement | null,
  searchBox: HTMLElement,
  callback: (lockers: ParcelLocker[]) => void
): void {
  if (!searchInput || !codeInput) return;

  let loaded = false;
  const load = async () => {
    if (loaded) return;
    loaded = true;
    const lockers = await loadAndSetupParcelLockers(
      searchInput,
      codeInput,
      searchBox
    );
    callback(lockers);
  };

  searchInput.addEventListener("focus", load, { once: true });
  searchInput.addEventListener("input", load, { once: true });
  codeInput.addEventListener("focus", load, { once: true });
}

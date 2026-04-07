import type { CartItem, DeliveryInfo } from "../types.js";
import { STORE_CONFIG } from "../config/store.js";
import { showToast } from "./utils.js";

const STORAGE_KEY = "cartStorage";

export class CartManager {
  private items: CartItem[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return;

      const productImageByName = new Map(
        STORE_CONFIG.products.map((p) => [p.name, p.image])
      );

      this.items = parsed
        .filter(
          (item): item is CartItem =>
            item &&
            typeof item.name === "string" &&
            typeof item.price === "number" &&
            typeof item.qty === "number"
        )
        .map((item): CartItem => {
          const fallbackImage = productImageByName.get(item.name);
          const hasLegacyImagePath =
            typeof item.image === "string" && item.image.startsWith("img/products/");
          const resolvedImage = !item.image || hasLegacyImagePath ? fallbackImage : item.image;
          if (resolvedImage !== undefined) {
            return { name: item.name, price: item.price, qty: item.qty, image: resolvedImage };
          }
          return { name: item.name, price: item.price, qty: item.qty };
        });
    } catch {
      this.items = [];
    }
  }

  public saveToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
  }

  public add(name: string, price: number, image: string): void {
    const existing = this.items.find((item) => item.name === name);
    if (existing) {
      existing.qty++;
    } else {
      this.items.push({ name, price, qty: 1, image });
    }
    this.saveToStorage();
  }

  public remove(name: string): void {
    const before = this.items.length;
    this.items = this.items.filter((i) => i.name !== name);
    if (this.items.length < before) {
      showToast(`Usunięto produkt ${name} z koszyka.`);
    }
  }

  public increaseQty(name: string): void {
    const item = this.items.find((i) => i.name === name);
    if (item) {
      item.qty++;
      showToast(`Dodano 1 szt. produktu ${name}.`);
    }
  }

  public decreaseQty(name: string): void {
    const item = this.items.find((i) => i.name === name);
    if (item && item.qty > 1) {
      item.qty--;
      showToast(`Usunięto 1 szt. produktu ${name}.`);
    }
  }

  public clear(): void {
    this.items = [];
    this.saveToStorage();
  }

  public getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  public getTotalItemsCount(): number {
    return this.items.reduce((sum, item) => sum + item.qty, 0);
  }

  public getDeliveryInfo(): DeliveryInfo {
    const totalPrice = this.getTotalPrice();
    const totalItems = this.getTotalItemsCount();
    const numberOfParcels = Math.ceil(
      totalItems / STORE_CONFIG.delivery.itemsPerParcel
    );
    return {
      finalCost:
        totalPrice > STORE_CONFIG.delivery.freeThreshold
          ? 0
          : STORE_CONFIG.delivery.baseCost,
      numberOfParcels,
    };
  }

  public getAll(): CartItem[] {
    return [...this.items];
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }
}

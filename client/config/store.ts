export type ProductId = "poster" | "newsletter";

export type StoreProduct = {
  id: ProductId;
  name: string;
  description: string;
  price: number;
  image: string;
};

const PRODUCT_IMAGES = {
  poster: new URL("../img/products/galaretka_drobiowa.png", import.meta.url).href,
  newsletter: new URL("../img/products/galaretka_wieprzowa.png", import.meta.url).href,
} as const;

export const STORE_CONFIG = {
  products: [
    {
      id: "poster",
      name: "Pakiet plakatów edukacyjnych",
      description: "Gotowe grafiki PDF do gazetki szkolnej dla nauczycieli.",
      price: 45,
      image: PRODUCT_IMAGES.poster,
    },
    {
      id: "newsletter",
      name: "Szablony gazetki szkolnej",
      description: "Zestaw szablonów PDF do szybkiego przygotowania gazetki.",
      price: 52,
      image: PRODUCT_IMAGES.newsletter,
    },
  ] as StoreProduct[],
  contact: {
    phoneDisplay: "794 535 366",
    phoneHref: "tel:+48794535366",
    generalEmail: "kontakt@szkolne-gazetki.pl",
    complaintsEmail: "reklamacje@szkolne-gazetki.pl",
    fulfillmentHours:
      "Obsługa zamówień od poniedziałku do piątku: 09:00-18:00.",
  },
  payment: {
    accountHolder: "Szkolne gazetki",
    accountNumber: "60 1140 2004 0000 3102 4831 8846",
    blikPhone: "794 535 366",
  },
} as const;

export function getProductConfig(productId: ProductId): StoreProduct | undefined {
  return STORE_CONFIG.products.find((product) => product.id === productId);
}

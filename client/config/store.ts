export type ProductId = "drobiowa" | "wieprzowa";

export type StoreProduct = {
  id: ProductId;
  name: string;
  description: string;
  price: number;
  image: string;
};

export const STORE_CONFIG = {
  products: [
    {
      id: "drobiowa",
      name: "Galaretka drobiowa",
      description: "Z warzywami, tradycyjna receptura",
      price: 18,
      image: "img/products/galaretka_drobiowa.png",
    },
    {
      id: "wieprzowa",
      name: "Galaretka wieprzowa",
      description: "Z warzywami, tradycyjna receptura",
      price: 19,
      image: "img/products/galaretka_wieprzowa.png",
    },
  ] as StoreProduct[],
  delivery: {
    freeThreshold: 100,
    baseCost: 15,
    itemsPerParcel: 4,
  },
  contact: {
    phoneDisplay: "794 535 366",
    phoneHref: "tel:+48794535366",
    generalEmail: "kontakt@galaretkarnia.pl",
    complaintsEmail: "reklamacje@galaretkarnia.pl",
    fulfillmentHours:
      "Godziny realizacji zamówień: pon.-sob. 14:00-20:00. Przy wpłacie zaksięgowanej do 14:00 wysyłamy zamówienie tego samego dnia.",
  },
  payment: {
    accountHolder: "Galaretkarnia",
    accountNumber: "60 1140 2004 0000 3102 4831 8846",
    blikPhone: "794 535 366",
  },
} as const;

export function getProductConfig(productId: string): StoreProduct | undefined {
  return STORE_CONFIG.products.find((product) => product.id === productId);
}
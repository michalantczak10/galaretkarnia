// Cart and Product Types
export type ProductId = "drobiowa" | "wieprzowa";

export interface CartItem {
  name: string;
  price: number;
  qty: number;
  image?: string;
}

export interface ParcelLocker {
  code: string;
  name: string;
  address: string;
}

export interface DeliveryInfo {
  finalCost: number;
  numberOfParcels: number;
}

export interface OrderConfirmationData {
  orderRef?: string;
  orderId?: string;
  status?: string;
  orderTotal?: string;
  total?: string;
  transferTitle?: string;
  paymentTarget?: string;
}

export interface OrderData {
  items: Array<{ name: string; price: number; qty: number }>;
  phone: string;
  parcelLockerCode: string;
  paymentMethod: string;
  productsTotal: number;
  deliveryCost: number;
  total: number;
  notes: string;
  createOptionalAccount: boolean;
  optionalAccountEmail: string;
}

export type ToastVariant = "success" | "warning" | "info";

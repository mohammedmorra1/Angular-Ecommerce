export interface ApiProduct {
  id: number;
  title: string;
  category: string;
  currentPrice: number;
  oldPrice?: number;
  description: string;
  imageUrl: string;
  availableSizes: string[];
  tags: string[];
  stock: number;
  brand: string;
  rating: number;
  isNew: boolean;
}

export interface Product {
  id: number;
  title: string;
  category: string;
  currentPrice: number;
  oldPrice?: number;
  description: string;
  imageUrl: string;
  availableSizes: string[];
  tags: string[];
  stock: number;
  brand: string;
  rating: number;
  isNew: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface OrderItem {
  productId: number;
  title: string;
  quantity: number;
  selectedSize: string;
  unitPrice: number;
}

export interface Order {
  id: string;
  paymentIntentId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
}

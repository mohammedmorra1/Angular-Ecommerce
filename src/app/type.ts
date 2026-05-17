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
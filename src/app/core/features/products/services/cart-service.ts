import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product } from '../../../../../Types/type';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  addToCart(product: Product, size: string, quantity: number = 1) {
    this.cartItems.update(items => {
      const existingItem = items.find(
        (item) => item.product.id === product.id && item.selectedSize === size
      );
      if (existingItem) {
        existingItem.quantity += quantity;
        return [...items];
      } else {
        return [...items, { product, quantity, selectedSize: size }];
      }
    });
  }

  removeFromCart(productId: number, selectedSize: string) {
    this.cartItems.update(items =>
      items.filter(item => !(item.product.id === productId && item.selectedSize === selectedSize))
    );
  }

  clearCart() {
    this.cartItems.set([]);
  }

  isInCart(productId: number): boolean {
    return this.cartItems().some((item) => item.product.id === productId);
  }

  totalPrice = computed(() =>
    this.cartItems().reduce(
      (total, item) => total + item.product.currentPrice * item.quantity,
      0,
    )
  );

  totalInCents = computed(() => Math.round(this.totalPrice() * 100));
}

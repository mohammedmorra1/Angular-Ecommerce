import { Injectable } from '@angular/core';
import { CartItem, Product } from '../../../../../Types/type';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  //<button (click)="addToCart(product)">Add To Cart </button>
  addToCart(product: Product, size: string, quantity: number = 1) {
 const existingItem = this.cartItems.find(
    (item) => item.product.id === product.id && item.selectedSize === size
  );
     if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity, selectedSize: size });
    }
  }

  removeFromCart(productId: number) {
    this.cartItems = this.cartItems.filter((item) => item.product.id !== productId);
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  clearCart() {
    this.cartItems = [];
  }

  isInCart(productId: number): boolean {
    return this.cartItems.some((item) => item.product.id === productId);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.product.currentPrice * item.quantity,
      0,
    );
  }

  getTotalInCents(): number {
    return Math.round(this.getTotalPrice() * 100);
  }
}

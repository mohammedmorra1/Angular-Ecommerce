import { Injectable, signal } from '@angular/core';
import { CartItem, Product } from '../../../../../Types/type';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];
  cartOpen = signal(false);

  constructor() {
    this.loadFromStorage();
  }

  // ─── STORAGE ───────────────────────────────────────────
  private saveToStorage() {
    localStorage.setItem('vanta_cart', JSON.stringify(this.cartItems));
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('vanta_cart');
      if (stored) {
        this.cartItems = JSON.parse(stored);
      }
    } catch {
      this.cartItems = [];
    }
  }

  // ─── CART ACTIONS ──────────────────────────────────────
  addToCart(product: Product, size: string, quantity: number = 1) {
    const existingItem = this.cartItems.find(
      (item) => item.product.id === product.id && item.selectedSize === size
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity, selectedSize: size });
    }
    this.saveToStorage(); // ← was missing
  }

  removeFromCart(productId: number, selectedSize?: string) {
    if (selectedSize) {
      this.cartItems = this.cartItems.filter(
        (item) => !(item.product.id === productId && item.selectedSize === selectedSize)
      );
    } else {
      this.cartItems = this.cartItems.filter(
        (item) => item.product.id !== productId
      );
    }
    this.saveToStorage();
  }

  clearCart() {
    this.cartItems = [];
    this.saveToStorage(); // ← was missing
  }

  // ─── CART PANEL ────────────────────────────────────────
  openCart() {
    this.cartOpen.set(true);
  }

  closeCart() {
    this.cartOpen.set(false);
  }

  toggleCart() {
    this.cartOpen.update(val => !val);
  }

  // ─── GETTERS ───────────────────────────────────────────
  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  isInCart(productId: number): boolean {
    return this.cartItems.some((item) => item.product.id === productId);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.product.currentPrice * item.quantity,
      0
    );
  }

  getTotalInCents(): number {
    return Math.round(this.getTotalPrice() * 100);
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }
}

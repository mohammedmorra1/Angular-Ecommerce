import { Injectable, signal, computed } from '@angular/core';
import { Order, OrderItem } from '../../../../../Types/type';
import { CartService } from '../../products/services/cart-service';

const STORAGE_KEY = 'orders';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orders = signal<Order[]>(this.loadOrders());

  ordersList = computed(() => this.orders());

  constructor(private cartService: CartService) {}

  createOrder(paymentIntentId: string): Order {
    const cartItems = this.cartService.cartItems();
    const shippingCost = 12;
    const subtotal = this.cartService.totalPrice();

    const orderItems: OrderItem[] = cartItems.map((item) => ({
      productId: item.product.id,
      title: item.product.title,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      unitPrice: item.product.currentPrice,
    }));

    const order: Order = {
      id: crypto.randomUUID(),
      paymentIntentId,
      items: orderItems,
      subtotal,
      shipping: shippingCost,
      total: subtotal + shippingCost,
      status: 'succeeded',
      createdAt: new Date().toISOString(),
    };

    this.orders.update((prev) => [order, ...prev]);
    this.saveOrders();
    return order;
  }

  getOrderById(id: string): Order | undefined {
    return this.orders().find((o) => o.id === id);
  }

  getOrderByPaymentIntent(paymentIntentId: string): Order | undefined {
    return this.orders().find((o) => o.paymentIntentId === paymentIntentId);
  }

  private loadOrders(): Order[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveOrders(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.orders()));
  }
}

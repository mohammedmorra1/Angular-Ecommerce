import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartItem } from "../../../../../../Types/type";
import { CartService } from "../../services/cart-service";
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [RouterOutlet],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  constructor(public cartService: CartService,private router: Router) {}

   close() {
    this.closed.emit();
  }

  closeOnOverlay(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('cart-overlay')) {
      this.close();
    }
  }

  incrementQuantity(item: CartItem) {
    this.cartService.addToCart(item.product, item.selectedSize, 1);

  }

  decrementQuantity(item: CartItem) {
    if (item.quantity > 1) {
      this.cartService.addToCart(item.product, item.selectedSize, -1);
    } else {
      this.cartService.removeFromCart(item.product.id);
    }
  }

  goToCheckout() {
    this.close();
    this.router.navigate(['/checkout']);
  }
}

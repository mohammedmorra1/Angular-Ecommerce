import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service';
import { OrderService } from '../../services/order-service';

@Component({
  selector: 'app-payment-success',
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.css',
})
export class PaymentSuccess implements OnInit {
  verifying = true;
  success = false;
  orderId = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const status = params['redirect_status'];
      const paymentIntentId = params['payment_intent'] || '';

      if (status === 'succeeded') {
        const order = this.orderService.createOrder(paymentIntentId);
        this.orderId = order.id;
        this.cartService.clearCart();
        this.success = true;
      } else {
        this.router.navigate(['/checkout']);
      }

      this.verifying = false;
    });
  }
  keepShopping() {
    this.router.navigate(['/']);
  }
}

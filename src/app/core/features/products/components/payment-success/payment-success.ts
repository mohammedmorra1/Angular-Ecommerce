import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-payment-success',
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.css',
})
export class PaymentSuccess implements OnInit {
  verifying = true;
  success = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const status = params['redirect_status'];

      if (status === 'succeeded') {
        this.cartService.clearCart();
        this.success = true;
      } else {
        // payment failed or cancelled — go back to checkout
        this.router.navigate(['/payment']);
      }

      this.verifying = false;
    });
  }
  keepShopping() {
    this.router.navigate(['/']);
  }
}

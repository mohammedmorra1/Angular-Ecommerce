import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { CartService } from '../../services/cart-service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  stripe: Stripe | null = null;
  // cardElement: any;
  // email = '';
  // loading = false;
  // errorMessage = '';
  // shippingCost = 12;

  elements: StripeElements | null = null;
  loading = false;
  message = '';
  shippingCost = 12;
  stripeLoading = true;

  constructor(
    private cartService: CartService,
    private http: HttpClient,
  ) {}

  async ngAfterViewInit() {
    const amount = this.cartService.totalInCents();
    if (amount <= 0) {
      this.message = 'Your cart is empty';
      this.stripeLoading = false;
      return;
    }
    this.stripeLoading = true;
    this.stripe = await loadStripe(environment.stripePublicKey);
    this.http
      .post<{
        clientSecret: string;
      }>(`${environment.paymentApiUrl}/create-payment-intent`, { amount: amount })
      .subscribe({
        next: ({ clientSecret }) => {
          if (!this.stripe) return;

          // this.elements = this.stripe.elements({ clientSecret : clientSecret });
          this.elements = this.stripe.elements({
           clientSecret : clientSecret,
            appearance: {
              theme: 'night',
              variables: {
                colorPrimary: '#4ade80',
                colorBackground: '#0f0f0f',
                colorText: '#ffffff',
                colorDanger: '#ff4d4d',
                colorTextPlaceholder: '#555555',
                borderRadius: '6px',
                fontFamily: 'sans-serif',
              },
              rules: {
                '.Input': {
                  backgroundColor: '#111111',
                  border: '1px solid #2a2a2a',
                  color: '#ffffff',
                },
                '.Input:focus': {
                  border: '1px solid #4ade80',
                  boxShadow: 'none',
                },
                '.Tab': {
                  backgroundColor: '#111111',
                  border: '1px solid #2a2a2a',
                  color: '#888888',
                },
                '.Tab--selected': {
                  backgroundColor: '#111111',
                  border: '1px solid #4ade80',
                  color: '#ffffff',
                },
                '.Tab:hover': {
                  color: '#ffffff',
                },
                '.Label': {
                  color: '#888888',
                  fontSize: '12px',
                  letterSpacing: '0.05em',
                },
                '.Error': {
                  color: '#ff4d4d',
                },
              },
            },
          });
          const paymentElement = this.elements.create('payment', {
            layout: 'tabs',
          });
          paymentElement.mount('#payment-element');
          this.stripeLoading = false;
        },
        error: () => {
          this.message = 'Could not load payment form';
          this.stripeLoading = false;
        },
      });
  }

  async pay() {
    if (!this.stripe || !this.elements) {
      this.message = 'Payment form is not ready';
      return;
    }

    this.loading = true;
    this.message = '';

    const result = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (result.error) {
      this.message = result.error.message || 'Payment failed';
      this.loading = false;
    }
  }

  get cartItems() {
    return this.cartService.cartItems();
  }

  get subtotal() {
    return this.cartService.totalPrice();
  }

  get total() {
    return this.subtotal + this.shippingCost;
  }
}

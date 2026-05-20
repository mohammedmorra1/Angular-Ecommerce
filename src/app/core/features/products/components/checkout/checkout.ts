import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { CartService } from '../../services/cart-service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit, AfterViewInit {
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  loading = false;
  message = '';
  shippingCost = 12;
  private clientSecret = '';
  stripeLoading = true;  

  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  // fetch / subscribe to client secret from your API
  ngOnInit() {
    const amount = this.cartService.getTotalInCents();

    if (amount <= 0) {
      this.message = 'Your cart is empty';
      return;
    }

    this.http
      .post<{
        clientSecret: string;
      }>('http://localhost:5199/api/payments/create-payment-intent', { amount })
      .subscribe({
        next: ({ clientSecret }) => {
          this.clientSecret = clientSecret;
          this.cdr.detectChanges();
          this.mountStripe();
        },
        error: () => {
          this.message = 'Could not load payment form';
        },
      });
  }

  //load Stripe and mount element
  async ngAfterViewInit() {
    this.stripe = await loadStripe(
      'STRIPE_PUBLIC_KEY',
    );
    if (this.clientSecret) {
      this.mountStripe();
    }
  }

  private mountStripe() {
    if (!this.stripe || !this.clientSecret) return;

    this.elements = this.stripe.elements({
      clientSecret: this.clientSecret,
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
          '.Tab:hover': { color: '#ffffff' },
          '.Label': {
            color: '#888888',
            fontSize: '12px',
            letterSpacing: '0.05em',
          },
          '.Error': { color: '#ff4d4d' },
        },
      },
    });

    setTimeout(() => {
      const paymentElement = this.elements!.create('payment', {
        layout: 'tabs',
        paymentMethodOrder: ['card'],
      });
      paymentElement.mount('#payment-element');
      this.cdr.detectChanges();
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
        return_url: 'http://localhost:4200/payment-success',
      },
    });

    if (result.error) {
      this.message = result.error.message || 'Payment failed';
      this.loading = false;
    }
  }

  get cartItems() {
    return this.cartService.getCartItems();
  }

  get subtotal() {
    return this.cartService.getTotalPrice();
  }

  get total() {
    return this.subtotal + this.shippingCost;
  }
}

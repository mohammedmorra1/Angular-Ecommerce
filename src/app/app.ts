import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from './shared/components/header/header';
import { AppFooter } from './shared/components/footer/footer';
import { Cart } from './core/features/products/components/cart/cart';
import { CartService } from './core/features/products/services/cart-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeader, AppFooter, Cart],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  cartService = inject(CartService);
}

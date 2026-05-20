import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/features/products/services/cart-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class AppHeader {
  cartService = inject(CartService);
  menuOpen = signal(false);

  isLoggedIn(): boolean {
    return !!localStorage.getItem('username');
  }

  get username(): string {
    return localStorage.getItem('username') ?? '';
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}

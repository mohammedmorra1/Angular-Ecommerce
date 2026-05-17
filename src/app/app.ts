import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './core/features/products/components/home/home';
import { Shop } from "./core/features/products/components/shop/shop";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Home, Shop],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Ecommerce');
}

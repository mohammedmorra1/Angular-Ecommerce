import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductDetailTest } from "./core/features/products/components/product-detail-test/product-detail-test";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductDetailTest],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Ecommerce');
}

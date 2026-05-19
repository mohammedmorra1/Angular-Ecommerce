import { Component } from '@angular/core';
import { CartService } from '../../services/cart-service';
import { Product } from '../../../../../../Types/type';
import { UpperCasePipe } from '@angular/common';
import { Cart } from '../cart/cart';


@Component({
  selector: 'app-product-detail-test',
  imports: [UpperCasePipe , Cart],
  templateUrl: './product-detail-test.html',
  styleUrl: './product-detail-test.css',
})
export class ProductDetailTest {
  cartOpen = false;
  selectedSize = '';

  mockProduct: Product = {
    id: 1,
    title: 'Chrome Puffer',
    category: 'Outerwear',
    currentPrice: 320,
    description: 'Glossy metallic puffer jacket. Statement outerwear.',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
    availableSizes: ['S', 'M', 'L', 'XL'],
    tags: ['#STATEMENT', '#FUTURISTIC', '#PUFFER'],
    stock: 10,
    brand: 'VANTA',
    rating: 4.8,
    isNew: true,
  };

  constructor(public cartService: CartService) {}

  selectSize(size: string) {
    this.selectedSize = size;
  }

  addToCart() {
    if (!this.selectedSize) {
      alert('Please select a size.');
      return;
    }
    this.cartService.addToCart(this.mockProduct, this.selectedSize);
    this.cartOpen = true;
  }
}

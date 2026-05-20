import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UpperCasePipe } from '@angular/common';
import { Cart } from '../cart/cart';
import { CartService } from '../../services/cart-service';
import { ProductService } from '../../services/productService';
import { Product } from '../../../../../../Types/type';

@Component({
  selector: 'app-product-detail',
  imports: [UpperCasePipe, Cart],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  cartOpen = false;
  selectedSize = '';

  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private productService = inject(ProductService);
  constructor(public cartService: CartService) {}

  product = computed<Product | undefined>(() => {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    return this.productService.products().find(p => p.id === id);
  });

  ngOnInit() {
    if (this.productService.products().length === 0) {
      this.productService.getProducts();
    }
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  addToCart() {
    const p = this.product();
    if (!p || !this.selectedSize) {
      alert('Please select a size.');
      return;
    }
    this.cartService.addToCart(p, this.selectedSize);
    this.cartOpen = true;
  }

  goBack() {
    this.location.back();
  }
}

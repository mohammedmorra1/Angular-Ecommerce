import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/productService';
import { Card } from "../card/card";

@Component({
  selector: 'app-home',
  imports: [Card, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  productService = inject(ProductService);
  homeProducts = computed(()=>
  {
    const products = this.productService.products();
    return products.slice(0,8);
  })

  ngOnInit() {
    this.productService.getProducts();
  }
  
}

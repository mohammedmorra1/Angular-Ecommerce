import { Component, computed, inject } from '@angular/core';
import { Tabs } from "../tabs/tabs";
import { ProductService } from '../../services/productService';
import { Card } from "../card/card";

@Component({
  selector: 'app-shop',
  imports: [Tabs, Card],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {
  productService = inject(ProductService);

  products = computed(() =>{
    return this.productService.filteration();
  })

  hasMore = computed(() => this.productService.hasMore())

  ngOnInit() {
    this.productService.getProducts();
  }

  selector(category: string)
  {
    this.productService.category.set(category);
  }

  loadMore() {
    this.productService.loadMore();
  }
}

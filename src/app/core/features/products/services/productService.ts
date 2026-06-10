import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiProduct, Product } from '../../../../../Types/type';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = environment.apiBaseUrl;
  private mapProduct(apiProduct: ApiProduct): Product {
    return {
      id: apiProduct.id,
      title: apiProduct.title,
      category: apiProduct.category,
      currentPrice: apiProduct.currentPrice,
      oldPrice: apiProduct.oldPrice,
      description: apiProduct.description,
      imageUrl: `${apiProduct.imageUrl}?auto=compress&cs=tinysrgb&w=400`,
      availableSizes: apiProduct.availableSizes,
      tags: apiProduct.tags,
      stock: apiProduct.stock,
      brand: apiProduct.brand,
      rating: apiProduct.rating,
      isNew: apiProduct.isNew,
    };
  }
  http = inject(HttpClient);
  products = signal<Product[]>([]);
  category = signal<string>('All');
  page = signal<number>(1);
  limit = signal<number>(8);
  hasMore = signal<boolean>(true);

  getHomeProducts() {
    this.http.get<ApiProduct[]>(`${this.baseUrl}?limit=8`).subscribe((response) => {
      const mappedProducts = response.map((apiProduct) => this.mapProduct(apiProduct));
      this.products.set(mappedProducts);
    });
  }

  getProducts() {
    this.http
      .get<ApiProduct[]>(`${this.baseUrl}?page=${this.page()}&limit=${this.limit()}`)
      .subscribe((response) => {
        const mappedProducts = response.map((apiProduct) => this.mapProduct(apiProduct));
        this.products.update((prev) => [...prev, ...mappedProducts]);
        if (mappedProducts.length < this.limit()) {
          this.hasMore.set(false);
        }
      });
  }

  loadMore() {
    this.page.update((p) => p + 1);
    this.getProducts();
  }

  filteration = computed(() => {
    const products = this.products();
    if (this.category() === 'men') {
      return products.filter((p) => p.category == 'men');
    } else if (this.category() === 'women') {
      return products.filter((p) => p.category == 'women');
    } else if (this.category() === 'kids') {
      return products.filter((p) => p.category == 'kids');
    } else {
      return products;
    }
  });
}

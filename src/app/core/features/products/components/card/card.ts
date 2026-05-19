import { Component, inject, Input } from '@angular/core';
import { ProductService } from '../../services/productService';
import { Product } from '../../../../../../Types/type';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {

  @Input()
  cardProduct : Product =  {
  id: 0,
  title: "",
  category: "",
  currentPrice: 0,
  oldPrice: 0,
  description: "",
  imageUrl: "",
  availableSizes: [],
  tags: [],
  stock: 0,
  brand: "",
  rating: 0,
  isNew: false
}
  productService = inject(ProductService)
}

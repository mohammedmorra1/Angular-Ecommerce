import { Component, ElementRef, inject, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { StylistSearchService } from '../../../services/stylist-search-service';
import { Product } from '../../../../../../../Types/type';
import { compressImage } from '../../../utils';
import { Card } from '../../card/card';
import { Router } from '@angular/router';
@Component({
  selector: 'app-visual-search',
  imports: [Card],
  templateUrl: './visual-search.html',
  styleUrl: './visual-search.css',
})
export class VisualSearch {
  constructor(private router: Router) {}
  cdr = inject(ChangeDetectorRef);
  styleSearchService = inject(StylistSearchService);
  uploadedImage: string | null = null;
  sent = false;
  results: Product[] = [];

  async sendImage(event: any) {
    if (this.sent) return;
    this.sent = true;
    console.log('Image file selected:', event.target.files[0]);
    const file = event.target.files[0];
    if (file) {
      // show wait until image is compressed
      this.uploadedImage = null;
      this.cdr.detectChanges();
      const searchImageUrl = await compressImage(file);
      console.log('Compressed image URL:', searchImageUrl);
      this.uploadedImage = searchImageUrl;
      this.cdr.detectChanges();
      // get responses
      const res = await this.styleSearchService.searchImage(searchImageUrl);
      this.results = res as Product[];
      console.log('Search results:', this.results);
      this.cdr.detectChanges();
    }
  }
  reloadRoute(): void {
    window.location.reload();
  }
}

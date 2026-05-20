import { Component, ElementRef, inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { StylistSearchService } from '../../../services/stylist-search-service';
import { Product } from '../../../../../../type';

@Component({
  selector: 'app-stylist-search',
  imports: [],
  templateUrl: './stylist-search.html',
  styleUrl: './stylist-search.css',
})
export class StylistSearch {
  @ViewChild('chatHistory', { static: false }) chatHistory?: ElementRef<HTMLElement>;

  styleSearchService = inject(StylistSearchService);
  cdr = inject(ChangeDetectorRef);

  occasion: string = '';
  searchTexts: string[] = [];
  searchResults: Record<string, string[] | null> = {};
  isLoading = false;

  async getResults(occasion: string) {
    if (this.isLoading || !occasion?.trim()) {
      return;
    }

    this.isLoading = true;
    console.log('Searching for:', occasion);
    this.searchTexts.push(occasion);

    this.searchResults = {
      ...this.searchResults,
      [occasion]: null,
    };

    this.cdr.detectChanges();
    setTimeout(() => this.scrollToLatestMessage(), 0);

    try {
      const results = await this.styleSearchService.searchText(occasion);
      console.log('Search results received:', results);

      this.searchResults = {
        ...this.searchResults,
        [occasion]: (results as Product[]).map((p) => p.imageUrl),
      };
    } catch (error) {
      console.error('Stylist search failed:', error);
      this.searchResults = {
        ...this.searchResults,
        [occasion]: [],
      };
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
      setTimeout(() => this.scrollToLatestMessage(), 50);
    }
  }

  private scrollToLatestMessage() {
    const element = this.chatHistory?.nativeElement;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }
}

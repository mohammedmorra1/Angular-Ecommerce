import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tabs',
  imports: [],
  templateUrl: './tabs.html',
  styleUrl: './tabs.css',
})
export class Tabs {
  selected = 'all';

  @Output()
  selectedCategory = new EventEmitter()

  select(category: string) {
    this.selected = category;
    this.selectedCategory.emit(this.selected)
  }

}

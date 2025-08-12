import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar {
  @Output() search = new EventEmitter<string>();

  onSearch(input: HTMLInputElement) {
    const term = input.value.trim();
    if(term) {
      this.search.emit(term)
    }

    input.value = ''
  }
}

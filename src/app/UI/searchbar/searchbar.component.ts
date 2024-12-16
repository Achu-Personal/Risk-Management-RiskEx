import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss'
})
export class SearchbarComponent {

  @Output() searchChanged = new EventEmitter<string>();
  searchText: string = '';
  searchSubject: Subject<string> = new Subject();

  constructor() {

    this.searchSubject.pipe(debounceTime(300)).subscribe((searchText) => {
      this.searchChanged.emit(searchText);
    });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchText);
  }
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-dropdown',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './filter-dropdown.component.html',
  styleUrl: './filter-dropdown.component.scss'
})
export class FilterDropdownComponent {
  @Input() headerName: string = '';
  @Input() options: string[] = [];
  @Input() selectedOptions: string[] = [];
  @Output() filterChange = new EventEmitter<string[]>();

  isOpen = false;
  searchText = '';
  filteredOptions: string[] = [];
  selectAll = false;

  ngOnInit() {
    this.filteredOptions = [...this.options];
    this.updateSelectAllState();
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  filterOptions() {
    if (this.searchText) {
      this.filteredOptions = this.options.filter(option =>
        option.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredOptions = [...this.options];
    }
  }

  toggleSelectAll() {
    if (this.selectAll) {
      this.selectedOptions = [];
    } else {
      this.selectedOptions = [...this.filteredOptions];
    }
    this.selectAll = !this.selectAll;
  }

  toggleOption(option: string) {
    const index = this.selectedOptions.indexOf(option);
    if (index === -1) {
      this.selectedOptions.push(option);
    } else {
      this.selectedOptions.splice(index, 1);
    }
    this.updateSelectAllState();
  }

  updateSelectAllState() {
    this.selectAll = this.filteredOptions.length > 0 &&
      this.filteredOptions.every(option => this.selectedOptions.includes(option));
  }

  applyFilter() {
    this.filterChange.emit(this.selectedOptions);
    this.isOpen = false;
  }

  clearFilter() {
    this.selectedOptions = [];
    this.searchText = '';
    this.filterOptions();
    this.selectAll = false;
    this.filterChange.emit([]);
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.filter-container')) {
      this.isOpen = false;
    }
  }
}

import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent implements ControlValueAccessor {
  @Input() options: any[] = [];
  @Input() displayField: string = '';
  @Input() codeField: string = '';
  @Input() valueField: string = '';
  @Input() selectValue: string = 'Select an option';
  @Input() width: string = '100%';
  @Output() valueChange = new EventEmitter<any>();
  @Input() selectedValue: any = null;
  @Input() openDropdownId: string | undefined = undefined;
  @Input() dropdownId: string = '';
  @Output() openDropdown = new EventEmitter<string>();

  get isGlobalDropdownOpen() {
    return this.openDropdownId === this.dropdownId;
  }

  constructor(private cdr: ChangeDetectorRef) {}
  instance = 0;
  isfirst = false;
  static instance = 0;
  value: any = '';
  isDropdownOpen = false;
  searchQuery: string = '';

  ngOnInit() {
    console.log('get value of likelihood is ', this.selectedValue);

    if (this.selectedValue !== null) {
      this.value = this.selectedValue;
      console.log('get value of this.value is ', this.value);
    }
    setTimeout(() => {
      if (
        DropdownComponent.instance === 0 ||
        DropdownComponent.instance === 6 ||
        DropdownComponent.instance === 18
      ) {
        console.log('First time component loaded', DropdownComponent.instance);
        this.isfirst = true;
        this.cdr.detectChanges();
      } else {
        console.log(
          'Component has been loaded before',
          DropdownComponent.instance
        );
      }
      DropdownComponent.instance++;
    }, 100);
  }

  // Functions for ControlValueAccessor (this enables ngModel support)
  onChange = (value: any) => {};
  onTouched = () => {};

  // Write value to the component
  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
    }
  }

  // Register change callback (ngModel binding)
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Register touched callback (ngModel binding)
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Toggle dropdown visibility
  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();

    if (this.openDropdownId !== this.dropdownId) {
      // If another dropdown is open, close it and open this one
      this.isDropdownOpen = true;
      this.openDropdown.emit(this.dropdownId);
    } else {
      // Toggle the current dropdown
      this.isDropdownOpen = !this.isDropdownOpen;
      this.openDropdown.emit(this.isDropdownOpen ? this.dropdownId : undefined);
    }
  }

  // Getter for filtered options
  get filteredOptions(): any[] {
    return this.options.filter((opt) =>
      opt[this.displayField]
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase())
    );
  }

  // Handle selection change
  selectOption(item: any): void {
    this.value = item[this.valueField];
    console.log('the value is selected is', this.value);

    this.onChange(this.value); // Notify parent of the change
    this.onTouched(); // Mark as touched
    this.isDropdownOpen = false; // Close the dropdown
    this.searchQuery = ''; // Optionally clear the search input

    this.valueChange.emit(this.value);
    this.openDropdown.emit(undefined); // Notify parent to close all dropdowns
  }

  // Get selected option's display text
  getSelectedText(): string {
    const selectedOption = this.options.find(
      (opt) => opt[this.valueField] === this.value
    );
    const selectedpreoption = this.options.find(
      (opt) => opt[this.valueField] === this.selectedValue
    );
    return selectedOption
      ? selectedOption[this.displayField]
      : selectedpreoption
      ? selectedpreoption[this.displayField]
      : this.selectValue;
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const dropdown = document.querySelector('.dropdown-container');
    if (dropdown && !dropdown.contains(event.target as Node)) {
      this.isDropdownOpen = false;
      this.openDropdown.emit(undefined); // Notify parent to close all dropdowns
    }
  }
}

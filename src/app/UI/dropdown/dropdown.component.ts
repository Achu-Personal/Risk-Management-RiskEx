import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  Output,
  SimpleChanges,
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
  @Input() allowClear: boolean = false;
  @Input() clearText: string = 'Clear Selection';

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
    if (this.selectedValue !== null && this.selectedValue !== undefined) {
      this.value = this.selectedValue;
    }
    setTimeout(() => {
      if (
        DropdownComponent.instance === 0 ||
        DropdownComponent.instance === 6 ||
        DropdownComponent.instance === 18
      ) {
        this.isfirst = true;
        this.cdr.detectChanges();
      }
      DropdownComponent.instance++;
    }, 100);
  }

  // NEW: Handle changes to selectedValue input
  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedValue']) {
      const newValue = changes['selectedValue'].currentValue;
      if (newValue !== undefined && newValue !== this.value) {
        this.value = newValue;
        this.cdr.detectChanges();
      }
    }
  }

  // Functions for ControlValueAccessor (this enables ngModel support)
  onChange = (value: any) => {};
  onTouched = () => {};

  // Write value to the component
  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
      this.cdr.detectChanges();
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

  // Clear selection method
  clearSelection(event: MouseEvent): void {
    event.stopPropagation(); // Prevent dropdown from toggling
    this.value = null;
    this.selectedValue = null;
    this.onChange(null);
    this.onTouched();
    this.valueChange.emit(null);
    this.isDropdownOpen = false;
    this.openDropdown.emit(undefined);
  }

  // Check if there's a selected value
  hasValue(): boolean {
    return this.value !== null && this.value !== undefined && this.value !== '';
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
    this.onChange(this.value);
    this.onTouched();
    this.isDropdownOpen = false;
    this.searchQuery = '';
    this.valueChange.emit(this.value);
    this.openDropdown.emit(undefined);
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
      this.openDropdown.emit(undefined);
    }
  }
}

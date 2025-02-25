import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-date-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-date-field.component.html',
  styleUrl: './form-date-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormDateFieldComponent),
      multi: true
    }
  ]
})
export class FormDateFieldComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() required: string = '';
  value: string = ''; // Stores YYYY-MM-DD (for backend)
  displayValue: string = ''; // Stores DD/MM/YYYY (for user display)
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {
    if (value) {
      this.value = value;
      this.displayValue = this.convertToDisplayFormat(value);
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Convert YYYY-MM-DD → DD/MM/YYYY
  convertToDisplayFormat(value: string): string {
    const parts = value.split('-');
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : value;
  }

  // Convert DD/MM/YYYY → YYYY-MM-DD
  convertToModelFormat(value: string): string {
    const parts = value.split('/');
    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : value;
  }

  // Handles manual input
  onUserInput(event: any): void {
    let input = event.target.value.replace(/[^0-9/]/g, '');
    if (input.length > 10) input = input.slice(0, 10);
    this.displayValue = input;
  }

  // Validate and format on blur
  formatDate(): void {
    if (this.displayValue.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      this.value = this.convertToModelFormat(this.displayValue);
      this.onChange(this.value);
    } else {
      this.displayValue = ''; // Reset if invalid format
    }
  }

  // Handle date picker selection
  onDateSelection(event: any): void {
    this.value = event.target.value;
    this.displayValue = this.convertToDisplayFormat(this.value);
    this.onChange(this.value);
  }



  
}

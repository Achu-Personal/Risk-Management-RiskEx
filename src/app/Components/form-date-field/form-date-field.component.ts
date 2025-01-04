import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-date-field',
  standalone: true,
  imports: [CommonModule,FormsModule],
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
  @Input() label:string=''
  @Input() required:string=''

  value: string = '';
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onSelectionChanges(event: any): void {
    setTimeout(() => {
      this.onChange(this.value);
    }, 0);
  }
}

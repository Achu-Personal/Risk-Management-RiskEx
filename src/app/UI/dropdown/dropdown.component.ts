
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]

})
export class DropdownComponent implements ControlValueAccessor {

  @Input() options: any[] = [];
  @Input() displayField: string = '';
  @Input() valueField: string = '';
  selectedValue: string = '';
  @Input() width:string='100'
  @Input() bottom:string=''
  @Input() selectValue:string=''


  value: any = '';
  onChange = (value: any) => {};
  onTouched = () => {};


   // Write value to the component
   writeValue(value: any): void {
    this.value = value;
  }

  // Register change callback
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Register touched callback
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Handle selection change
  onSelectionChange(value: any): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();

  }




}

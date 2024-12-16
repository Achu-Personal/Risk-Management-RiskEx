import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor,  FormsModule,  NG_VALUE_ACCESSOR } from '@angular/forms';



@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ]
})
export class TextareaComponent implements ControlValueAccessor {
  @Input()label:string=''
  @Input()isRequired:string=''
  @Input()marginLeft:string=''
  binding: any;



  value: string = ''; // Holds the value of the textarea
  onChange: (value: any) => void = () => {}; // Function to call when the value changes
  onTouched: () => void = () => {}; // Function to call when the textarea is touched
control: any;






  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = '33px';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }




  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;  // Set the value coming from the form
      console.log("writeValue triggered");
      console.log(this.value);
    }
  }

  // Register onChange function
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  // Register onTouched function
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Called when the model value changes
  onSelectionChanges(event: any): void {
    console.log('onSelectionChanges triggered with value:', this.value);

    // Delay triggering the onChange callback to allow the value to update
    setTimeout(() => {
      this.onChange(this.value);  // Notify the form control of the value change
      console.log( this.value);  // Ensure value is updated
    }, 0);
  }



}

import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FocusDirective } from '../../Directives/focus.directive';

@Component({
  selector: 'app-form-text-area',
  standalone: true,
  imports: [CommonModule,FormsModule,FocusDirective],
  templateUrl: './form-text-area.component.html',
  styleUrl: './form-text-area.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTextAreaComponent),
      multi: true
    }
  ]
})
export class FormTextAreaComponent implements ControlValueAccessor {
  @Input() backgroundColor:string=''
  @Input() label:string=''
  @Input() required:string=''
  @Input() placeHolder:string=''
  @Input() message:string=''


  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const minHeight = 40;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.max(minHeight, textarea.scrollHeight)}px`;
  }

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

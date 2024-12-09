
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',

})
export class DropdownComponent {





  // @Input() data :Array<{ value: string; type: string }> = []


  // @Input()selectedOption :string=''
  // @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();


  // onSelectionChange(value: string): void {
  //   this.valueChange.emit(value);
  // }
  @Input() dropdownWidth: string = '150px';
  @Input() options: any[] = []; // Array of objects
  @Input() displayField: string = ''; // Field name for display text
  @Input() valueField: string = ''; // Field name for value
  @Output() selectionChange = new EventEmitter<string>(); // Notify parent of selection
  selectedValue: string = '';


  onSelectionChange(selectedValue: string) {
    this.selectionChange.emit(selectedValue);
  }

}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownComponent } from '../../UI/dropdown/dropdown.component';


@Component({
  selector: 'app-form-dropdown',
  standalone: true,
  imports: [DropdownComponent],
  templateUrl: './form-dropdown.component.html',
  styleUrl: './form-dropdown.component.scss'
})
export class FormDropdownComponent {
  @Input() dropdownData:any[]=[]
  @Input() dropdownDisplay:string=''
  @Input() dropdownValue:string=''
  @Input() label:string=''
  @Input() required:string=''
  @Input() selectValue:string=''
  @Output() change = new EventEmitter<any>();
  @Input() selectedValue: any = null;

  onChange(event: any): void {
    

    this.change.emit(event);


  }


}

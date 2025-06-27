import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownComponent } from '../../UI/dropdown/dropdown.component';
import { StyleButtonComponent } from '../../UI/style-button/style-button.component';

@Component({
  selector: 'app-form-data-not-in-list',
  standalone: true,
  imports: [FormsModule,DropdownComponent,ReactiveFormsModule,StyleButtonComponent],
  templateUrl: './form-data-not-in-list.component.html',
  styleUrl: './form-data-not-in-list.component.scss'
})
export class FormDataNotInListComponent {
  @Output() cancelForm = new EventEmitter<any>();
  @Output() sendData=new EventEmitter<any>();
  @Input() isAssignee:boolean=true
  @Input() textLabel:string=''
  @Input() dropdownDepartment:any[]=[]
  @Input() placeholder:string=''
  @Input() openDropdownId: string | undefined = undefined; // Get from parent
  @Output() openDropdown = new EventEmitter<string>(); // Notify parent
  @Input() assigneeDepartment: string | undefined = undefined;


  group=new FormGroup({
    fullName:new FormControl('', [Validators.required,Validators.minLength(3) ]),
    email:new FormControl('', [Validators.required,Validators.email ]),
    departmentId:new FormControl('', Validators.required)

  })
  constructor(private el: ElementRef){}



  cancel(){
    if(this.isAssignee==true){
      this.cancelForm.emit(true)
    }
    if(this.isAssignee==false){
      this.cancelForm.emit(false)
    }

  }
  onSubmit(){
    if(this.isAssignee==false){
      console.log(this.group.value);
    this.sendData.emit(this.group.value)
    this.cancel()
    }
    if(this.isAssignee==true){
      console.log(this.group.value);
      const payload={
        fullName:this.group.value.fullName,
        email:this.group.value.email,
        departmentId:Number(this.assigneeDepartment)
        }
        console.log("loghyhyhyhyhyhyhyh",payload)
      this.sendData.emit(payload)
      this.cancel()
    }


  }

  dropdownId = Math.random().toString(36).substring(2, 9);

  toggleDropdown() {
    this.openDropdown.emit(this.dropdownId); 
  }

  get isDropdownOpen() {
    return this.openDropdownId === this.dropdownId;
  }

}

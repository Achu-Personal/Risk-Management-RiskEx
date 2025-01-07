import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormButtonComponent } from '../../UI/form-button/form-button.component';
import { DropdownComponent } from '../../UI/dropdown/dropdown.component';

@Component({
  selector: 'app-form-data-not-in-list',
  standalone: true,
  imports: [FormButtonComponent,FormsModule,DropdownComponent,ReactiveFormsModule],
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
  @Input() bgColor:string=''

  group=new FormGroup({
    fullName:new FormControl(''),
    email:new FormControl(''),
    departmentId:new FormControl('')

  })
  constructor(private el: ElementRef){}

  ngOnInit(){
    this.el.nativeElement.style.setProperty('--bg-color', this.bgColor);
  }

  cancel(){
    if(this.isAssignee==true){
      this.cancelForm.emit(true)
    }
    if(this.isAssignee==false){
      this.cancelForm.emit(false)
    }

  }
  onSubmit(){
    console.log(this.group.value);
    this.sendData.emit(this.group.value)
    this.cancel()

  }

}

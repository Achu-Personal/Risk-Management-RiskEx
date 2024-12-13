import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { ButtonComponent } from "../../UI/button/button.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-qms-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, DropdownComponent, ButtonComponent,CommonModule],
  templateUrl: './qms-form.component.html',
  styleUrl: './qms-form.component.scss'
})
export class QMSFormComponent {

   @Input() riskTypeValue: string=''
  @Output() sendDataToParent = new EventEmitter<object>();
  isCustomSelected = false;
  newEmail = '';
  qmsForm=new FormGroup({
    riskType:new FormControl(''),
    riskName:new FormControl(''),
    description:new FormControl(''),
    riskImpact:new FormControl(''),
    projectId:new FormControl(''),
    likelihood:new FormControl(''),
    impact:new FormControl(''),
    mitigation:new FormControl(''),
    contingency:new FormControl(''),
    responsibilityOfAction:new FormControl(''),
    plannedActionDate:new FormControl(''),
    reviewer:new FormControl()


  })

  data:any
  descriptionText: string = '';
  dropdownData=[
    {"type":"Very Low","value":"1"},
    {"type":"Low","value":"Low"},
    {"type":"Medium","value":"Medium"},
    { "type":"High","value":"High"},
    { "type":"Very High","value":"Very High"},
  ];
  dropdownDataReviewer=[
    {"name":"Achu s nair","email":"123"},
    {"name":"Shamna Sherin","email":"123"},
    {"name":"Deepak Denny","email":"123"},
    { "name":"Bindhya C Philip","email":"123"},
    { "name":"Vivek V N","email":"123"},
  ];

constructor(public api:ApiService){}

  ngOninit(){
    this.api.getRiskCurrentAssessment().subscribe((res:any)=>{
      this.data=res
      console.log(this.data)

    })


  }



  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reset height to recalculate
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to match content
  }



  onsubmit(){
    this.qmsForm.get('riskType')?.setValue(this.riskTypeValue);
    console.log("Updated riskType value:", this.qmsForm.get('riskType')?.value);

    this.sendDataToParent.emit(this.qmsForm.value);
    console.log("actual data");

    console.log(this.qmsForm.value);

     }
     change(){
      this.isCustomSelected=true

     }

    //  ngOnChanges(changes: SimpleChanges): void {
    //   if (changes['riskType']) {
    //     console.log('Risk Type changed:', changes['riskType'].currentValue);
    //   }
    // }





}

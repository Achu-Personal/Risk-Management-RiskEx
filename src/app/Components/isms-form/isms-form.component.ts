import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from "../../UI/button/button.component";
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { ApiService } from '../../Services/api.service';
import { TextareaComponent } from "../../UI/textarea/textarea.component";

@Component({
  selector: 'app-isms-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ButtonComponent, DropdownComponent, TextareaComponent],
  templateUrl: './isms-form.component.html',
  styleUrl: './isms-form.component.scss'
})
export class ISMSFormComponent {
  @Output() sendDataToParent = new EventEmitter<object>();
  isCustomSelected = false;
  newEmail = '';
  @Input() riskTypeValue: string=''


  ismsForm=new FormGroup({
    riskType:new FormControl(''),
    status:new FormControl(''),
    riskName:new FormControl('',Validators.required),
    description:new FormControl('',[Validators.maxLength(1000),Validators.minLength(15),Validators.required]),
    riskImpact:new FormControl('',[Validators.maxLength(1000),Validators.minLength(15),Validators.required]),
    projectId:new FormControl(''),
    confidentialityLikelihood:new FormControl('',Validators.required),
    IntegrityLikelihood:new FormControl('',Validators.required),
    availabiltyLikelihood:new FormControl('',Validators.required),
    privacyLikelihood:new FormControl('',Validators.required),
    confidentialityImpact:new FormControl('',Validators.required),
    IntegrityImpact:new FormControl('',Validators.required),
    availabiltyImpact:new FormControl('',Validators.required),
    privacyImpact:new FormControl('',Validators.required),
    mitigation:new FormControl('',[Validators.maxLength(1000),Validators.minLength(15),Validators.required]),
    contingency:new FormControl(''),
    responsibilityOfAction:new FormControl('',[Validators.maxLength(20),Validators.minLength(5),Validators.required]),
    plannedActionDate:new FormControl('',Validators.required),
    reviewer:new FormControl('',Validators.required)


  })
  data:any
  descriptionText: string = '';
  dropdownData=[
    {"type":"Very Low","value":"Very Low"},
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
    if (this.ismsForm.valid) {

      this.ismsForm.get('riskType')?.setValue(this.riskTypeValue);
      this.ismsForm.get('status')?.setValue("open");
      console.log("Updated riskType value:", this.ismsForm.get('riskType')?.value);
      const formValue = this.ismsForm.getRawValue();
      this.sendDataToParent.emit(this.ismsForm.value);
      console.log("Actual data:", formValue);
      alert("saved successfull")
    } else {
      this.ismsForm.markAllAsTouched();
      alert("Form is invalid. Please fill out all required fields.");
    }

  }


}

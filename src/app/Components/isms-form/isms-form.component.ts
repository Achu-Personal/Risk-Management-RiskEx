import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from "../../UI/button/button.component";
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { ApiService } from '../../Services/api.service';
import { TextareaComponent } from "../../UI/textarea/textarea.component";
import { OverallRatingCardComponent } from "../../UI/overall-rating-card/overall-rating-card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-isms-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ButtonComponent, DropdownComponent, TextareaComponent, OverallRatingCardComponent,CommonModule],
  templateUrl: './isms-form.component.html',
  styleUrl: './isms-form.component.scss'
})
export class ISMSFormComponent {
  @Output() sendDataToParent = new EventEmitter<object>();
  isCustomSelected = false;
  newEmail = '';
  @Input() riskTypeValue: string=''
  selectedValue1: number  = 0;
  selectedValue2: number = 0;
  selectedValue3: number  = 0;
  selectedValue4: number = 0;
  selectedValue5: number  = 0;
  selectedValue6: number = 0;
  selectedValue7: number  = 0;
  selectedValue8: number = 0;
  result: number = 0;


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
  dropdownDataLikelihood=[
    {"type":"Very Low","value":"0.1"},
    {"type":"Low","value":"0.2"},
    {"type":"Medium","value":"0.4"},
    { "type":"High","value":"0.8"},
    { "type":"Very High","value":"1"},
  ];

  dropdownDataImpact=[
    {"type":"Very Low","value":"10"},
    {"type":"Low","value":"20"},
    {"type":"Medium","value":"40"},
    { "type":"High","value":"80"},
    { "type":"Very High","value":"100"},
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

  onDropdownChange1(value: any): void {
    this.selectedValue1 = value ? parseFloat(value.target.value) : 0; // Convert string value to number
    this.updateResult();  // Update the result when a value is selected
     }

     // Method to handle value change for the second dropdown
     onDropdownChange2(value: any): void {
       this.selectedValue2 = value ? parseFloat(value.target.value) : 0; // Convert string value to number
       this.updateResult();  // Update the result when a value is selected
     }

     onDropdownChange3(value: any): void {
      this.selectedValue3 = value ? parseFloat(value.target.value) : 0; // Convert string value to number
      this.updateResult();  // Update the result when a value is selected
       }

       // Method to handle value change for the second dropdown
       onDropdownChange4(value: any): void {
         this.selectedValue4 = value ? parseFloat(value.target.value) : 0; // Convert string value to number
         this.updateResult();  // Update the result when a value is selected
       }
       onDropdownChange5(value: any): void {
        this.selectedValue5 = value ? parseFloat(value.target.value) : 0; // Convert string value to number
        this.updateResult();  // Update the result when a value is selected
         }

         // Method to handle value change for the second dropdown
         onDropdownChange6(value: any): void {
           this.selectedValue6 = value ? parseFloat(value.target.value) : 0; // Convert string value to number
           this.updateResult();  // Update the result when a value is selected
         }
         onDropdownChange7(value: any): void {
          this.selectedValue7 = value ? parseFloat(value.target.value) : 0; // Convert string value to number
          this.updateResult();  // Update the result when a value is selected
           }

           // Method to handle value change for the second dropdown
           onDropdownChange8(value: any): void {
             this.selectedValue8 = value ? parseFloat(value.target.value) : 0; // Convert string value to number
             this.updateResult();  // Update the result when a value is selected
           }


     updateResult(): void {
      const val1 = this.selectedValue1 ?? 0;
      const val2 = this.selectedValue2 ?? 0;
      const val3 = this.selectedValue3 ?? 0;
      const val4 = this.selectedValue4 ?? 0;
      const val5 = this.selectedValue5 ?? 0;
      const val6 = this.selectedValue6 ?? 0;
      const val7 = this.selectedValue7 ?? 0;
      const val8 = this.selectedValue8 ?? 0;
      const confidentialityValue=val1*val5;
      const integrityValue=val2*val6;
      const availabiltyValue=val3*val7;
      const privacyValue=val4*val8;



    if (this.selectedValue1 !== 0 && this.selectedValue2 !== 0&& this.selectedValue3 !== 0&& this.selectedValue4 !== 0&& this.selectedValue5 !== 0&& this.selectedValue6 !== 0&& this.selectedValue7 !== 0&& this.selectedValue8 !== 0) {
      // If both dropdowns are selected, calculate the multiplication result and set it to `a`
      this.result = parseFloat((confidentialityValue+integrityValue+availabiltyValue+privacyValue).toFixed(2));
    }
     else if (this.selectedValue1 !== 0)
     {

      this.result = this.selectedValue1;
    }
    else if (this.selectedValue2 !== 0)
      {

       this.result = this.selectedValue2;
     }
     else if (this.selectedValue3 !== 0)
      {

       this.result = this.selectedValue3;
     }
     else if (this.selectedValue4 !== 0)
      {

       this.result = this.selectedValue4;
     }
     else if (this.selectedValue5 !== 0)
      {

       this.result = this.selectedValue5;
     }
     else if (this.selectedValue6 !== 0)
      {

       this.result = this.selectedValue6;
     }
     else if (this.selectedValue7 !== 0)
      {

       this.result = this.selectedValue7;
     }
     else if (this.selectedValue8 !== 0)
      {

       this.result = this.selectedValue8;
     }

    }




}

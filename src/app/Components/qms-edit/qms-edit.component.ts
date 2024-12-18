import { Component, EventEmitter, Input, output, Output } from '@angular/core';
import { EditTextAreaComponent } from "../../UI/edit-text-area/edit-text-area.component";
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextareaComponent } from "../../UI/textarea/textarea.component";
import { OverallRatingCardComponent } from "../../UI/overall-rating-card/overall-rating-card.component";
import { CommonModule } from '@angular/common';
import { ApiService } from '../../Services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qms-edit',
  standalone: true,
  imports: [EditTextAreaComponent, DropdownComponent, FormsModule, ReactiveFormsModule, TextareaComponent, OverallRatingCardComponent,CommonModule],
  templateUrl: './qms-edit.component.html',
  styleUrl: './qms-edit.component.scss'
})
export class QmsEditComponent {
  isEditable: boolean = false;
  isEditableRiskName: boolean = false;
  isEditableRiskDescription: boolean = false;
  isEditableImpact: boolean = false;
  isEditableMitigation: boolean = false;
  isEditableContingency: boolean = false;
  @Output() sendDataToParent = new EventEmitter<object>();
  selectedValue1: number  = 0;
  selectedValue2: number = 0;
  result: number = 0;
  @Input() dataObject: any;




  onEditToggled(field: string, isEditable: boolean): void {
    switch(field) {
      case 'RiskName':
        this.isEditableRiskName = isEditable;
        break;
      case 'RiskDescription':
        this.isEditableRiskDescription = isEditable;
        break;
      case 'Impact':
        this.isEditableImpact = isEditable;
        break;
      case 'Mitigation':
        this.isEditableMitigation = isEditable;
        break;
      case 'Contingency':
        this.isEditableContingency = isEditable;
        break;
      default:
        break;
    }
  }

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

  qmsForm=new FormGroup({
    riskType:new FormControl(''),
    riskName:new FormControl(''),
    description:new FormControl(''),
    riskImpact:new FormControl(''),
    projectId:new FormControl(''),
    likelihood:new FormControl(''),
    impact:new FormControl(''),
    postAssessmentLikelihood:new FormControl(''),
    postAssessmentImpact:new FormControl(''),
    mitigation:new FormControl(''),
    contingency:new FormControl(''),
    responsibilityOfAction:new FormControl(''),
    plannedActionDate:new FormControl(''),
    actualCloseDate:new FormControl(''),
    reviewer:new FormControl(),
    riskResponse:new FormControl()



  })
  onsubmit(){



    console.log("Updated riskType value:", this.qmsForm.get('riskType')?.value);
    const formValue = this.qmsForm.getRawValue();

    this.sendDataToParent.emit(this.qmsForm.value);
    console.log("actual data");
    alert("Data Saved Successfull");

    console.log(formValue);
    this.router.navigate(['/home']);

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

       // Method to calculate the multiplication of both selected values
       updateResult(): void {
         const val1 = this.selectedValue1 ?? 0;  // If null or undefined, default to 0
         const val2 = this.selectedValue2 ?? 0;  // If null or undefined, default to 0

       //   if (val1 !== 0 && val2 !== 0) {
       //     this.result = parseFloat((val1 * val2).toFixed(2));  // Multiply if both values are non-zero
       //   } else {
       //     this.result = 0;  // Default to 0 if either value is not selected
       //   }


       if (this.selectedValue1 !== 0 && this.selectedValue2 !== 0) {
         // If both dropdowns are selected, calculate the multiplication result and set it to `a`
         this.result = parseFloat((val1 * val2).toFixed(2));
       } else if (this.selectedValue1 !== 0) {
         // If only the first dropdown is selected, update `a` with the first value
         this.result = this.selectedValue1;
       } else if (this.selectedValue2 !== 0) {
         // If only the second dropdown is selected, update `a` with the second value
         this.result= this.selectedValue2;
       }

       }

       constructor(public api:ApiService,private router:Router){}

       ngOnInit(){

           this.qmsForm.patchValue({
             riskType: this.dataObject.risk_type,
             riskName: this.dataObject.risk_name,
             description: this.dataObject.risk_description,
             riskImpact: this.dataObject.impact_of_risk,
             projectId: this.dataObject.projectId,
             likelihood: this.dataObject.current_risk_assessment.integrity.likelihood,
             impact: this.dataObject.current_risk_assessment.integrity.impact,
             mitigation: this.dataObject.risk_mitigation,
             contingency: this.dataObject.risk_contingency,
             responsibilityOfAction: this.dataObject.responsibility_of_action,
             plannedActionDate: this.dataObject.planned_action_date,

           });

       console.log("hiii");



       }
       onCancel(): void {
        this.qmsForm.reset(); // Reset the form
        this.router.navigate(['/home']); // Navigate to the dashboard
      }

}

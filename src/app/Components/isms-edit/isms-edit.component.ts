import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditTextAreaComponent } from "../../UI/edit-text-area/edit-text-area.component";
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { TextareaComponent } from "../../UI/textarea/textarea.component";
import { OverallRatingCardComponent } from "../../UI/overall-rating-card/overall-rating-card.component";
import { CommonModule } from '@angular/common';
import { ApiService } from '../../Services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-isms-edit',
  standalone: true,
  imports: [EditTextAreaComponent, DropdownComponent, TextareaComponent, ReactiveFormsModule, OverallRatingCardComponent,CommonModule],
  templateUrl: './isms-edit.component.html',
  styleUrl: './isms-edit.component.scss'
})
export class IsmsEditComponent {
  isEditable: boolean = false;
  isEditableRiskName: boolean = false;
  isEditableRiskDescription: boolean = false;
  isEditableImpact: boolean = false;
  isEditableMitigation: boolean = false;
  isEditableContingency: boolean = false;
  @Output() sendDataToParent = new EventEmitter<object>();
  result:number=0


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

  ismsForm=new FormGroup({
    riskType:new FormControl(''),
    riskName:new FormControl(''),
    description:new FormControl(''),
    riskImpact:new FormControl(''),
    projectId:new FormControl(''),
    confidentialityLikelihood:new FormControl(''),
    IntegrityLikelihood:new FormControl(''),
    availabiltyLikelihood:new FormControl(''),
    privacyLikelihood:new FormControl(''),
    confidentialityImpact:new FormControl(''),
    IntegrityImpact:new FormControl(''),
    availabiltyImpact:new FormControl(''),
    privacyImpact:new FormControl(''),
    postConfidentialityLikelihood:new FormControl(''),
    postIntegrityLikelihood:new FormControl(''),
    postAvailabiltyLikelihood:new FormControl(''),
    postPrivacyLikelihood:new FormControl(''),
    postConfidentialityImpact:new FormControl(''),
    postIntegrityImpact:new FormControl(''),
    postAvailabiltyImpact:new FormControl(''),
    postPrivacyImpact:new FormControl(''),
    mitigation:new FormControl(''),
    contingency:new FormControl(''),
    responsibilityOfAction:new FormControl(''),
    plannedActionDate:new FormControl(''),
    actualCloseDate:new FormControl(''),
    reviewer:new FormControl(),
    riskResponse:new FormControl()



  })
  onsubmit(){



    console.log("Updated riskType value:", this.ismsForm.get('riskType')?.value);
    const formValue = this.ismsForm.getRawValue();

    this.sendDataToParent.emit(this.ismsForm.value);
    console.log("actual data");
    alert("Data Saved Successfull");

    console.log(formValue);
    this.router.navigate(['/home']);

     }
     constructor(public api:ApiService,private router:Router){}


     onCancel(): void {
      this.ismsForm.reset(); // Reset the form
      this.router.navigate(['/home']); // Navigate to the dashboard
    }

}

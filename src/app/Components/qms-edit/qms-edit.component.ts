import { Component, EventEmitter, Output } from '@angular/core';
import { EditTextAreaComponent } from "../../UI/edit-text-area/edit-text-area.component";
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextareaComponent } from "../../UI/textarea/textarea.component";

@Component({
  selector: 'app-qms-edit',
  standalone: true,
  imports: [EditTextAreaComponent, DropdownComponent, FormsModule, ReactiveFormsModule, TextareaComponent],
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

    console.log(formValue);

     }



}

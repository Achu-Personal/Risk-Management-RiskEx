import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    mitigation:new FormControl(''),
    contingency:new FormControl(''),
    responsibilityOfAction:new FormControl(''),
    plannedActionDate:new FormControl(''),
    reviewer:new FormControl()


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
    const userConfirmed = window.confirm('Do you want to save?');
    if (userConfirmed) {
      this.saveData();
      this.ismsForm.get('riskType')?.setValue(this.riskTypeValue);
    this.ismsForm.get('status')?.setValue("open");
    console.log("Updated riskType value:", this.ismsForm.get('riskType')?.value);

    this.sendDataToParent.emit(this.ismsForm.value);
    console.log("actual data");

    console.log(this.ismsForm.value);

    } else {
      alert('User canceled saving.');
    }


  }

  // ngOnChanges(changes: SimpleChanges): void {
  //     if (changes['riskType']) {
  //       console.log('Risk Type changed:', changes['riskType'].currentValue);
  //     }
  //  }

  saveData() {
      alert('Data saved successfully!');

    }
}

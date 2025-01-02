import { Component, Input} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { ButtonComponent } from "../../UI/button/button.component";
import { CommonModule } from '@angular/common';
import { TextareaComponent } from "../../UI/textarea/textarea.component";
import { OverallRatingCardComponent } from "../../UI/overall-rating-card/overall-rating-card.component";
import { BodyContainerComponent } from "../body-container/body-container.component";
import { ApiService } from '../../Services/api.service';


@Component({
  selector: 'app-qms-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, DropdownComponent, ButtonComponent, CommonModule, TextareaComponent, OverallRatingCardComponent, BodyContainerComponent],
  templateUrl: './qms-form.component.html',
  styleUrl: './qms-form.component.scss'
})
export class QMSFormComponent {

@Input() riskTypeValue: number=1
result: number = 0;
reviewerNotInList:boolean=false
assigneeNotInList:boolean=false
isAdmin:string='admin'
likelihoodValue:number=0
impactValue:number=0
riskFactor:number=0
riskId:string='sfm_003'
dropdownDataLikelihood: any[] = []
dropdownDataImpact:any[]=[]
dropdownDataProject:any[]=[]
department:string='SFM'

constructor(private api:ApiService){}


qmsForm=new FormGroup({



  riskName:new FormControl('',Validators.required),
  description:new FormControl('',[Validators.maxLength(1000),Validators.minLength(15),Validators.required]),
  impact:new FormControl('',[Validators.maxLength(1000),Validators.minLength(15),Validators.required]),
  projectId:new FormControl(''),
  likelihood:new FormControl('',Validators.required),
  impactValue:new FormControl('',Validators.required),
  mitigation:new FormControl('',[Validators.maxLength(1000),Validators.minLength(15),Validators.required]),
  contingency:new FormControl(''),
  responsibileUserId:new FormControl('',[Validators.maxLength(20),Validators.minLength(5),Validators.required]),
  plannedActionDate:new FormControl('',Validators.required),
  reviewerId:new FormControl('',Validators.required),
  DepartmentId:new FormControl(''),
  userId:new FormControl(''),
  externalReviewerId:new FormControl(''),


})



// dropdownDataLikelihood=[
//   { "type":"Select Likelihood","value":""},
//   {"type":"Low","value":"1"},
//   {"type":"Medium","value":"2"},
//   { "type":"High","value":"3"},
//   { "type":"Critical","value":"4"}
// ];

// dropdownDataImpact=[
//   { "type":"select Impact","value":""},
//   {"type":"Low","value":"1"},
//   {"type":"Medium","value":"2"},
//   { "type":"High","value":"3"},
//   { "type":"Critical","value":"4"}
// ];

dropdownDataReviewer=[
  {"name":"Select--","email":""},
  {"name":"Achu s nair","email":"1"},
  {"name":"Shamna Sherin","email":"2"},
  {"name":"Deepak Denny","email":"3"},
  { "name":"Bindhya C Philip","email":"4"},
  { "name":"Vivek V N","email":"5"},
];

// dropdownDataProject=[
//   {"name":"Select--","id":""},
//   {"name":"japanese training","id":"1"},
//   {"name":"risk management","id":"2"},
//   {"name":"pit-stop","id":"3"},
//   { "name":"query management","id":"4"},
//   { "name":"HR inventory","id":"5"},
// ];

dropdownDataDepartment=[
  {"name":"Select--","id":""},
  {"name":"SFM","id":"1"},
  {"name":"ACE","id":"2"},
  {"name":"HR","id":"3"},
  { "name":"L&D","id":"4"},
  { "name":"DU1","id":"5"},
];

autoResize(event: Event): void {
  const textarea = event.target as HTMLTextAreaElement;
  const minHeight = 40;
  textarea.style.height = 'auto';
  textarea.style.height = `${Math.max(minHeight, textarea.scrollHeight)}px`;
}

isReviewerNotInList(){
  this.reviewerNotInList=!this.reviewerNotInList
}

isAssigneeNotInList(){
  this.assigneeNotInList=!this.assigneeNotInList
}

onDropdownChangelikelihood(value: any): void {
 this.likelihoodValue = value ? parseFloat(value.target.value) : 0;
 this.calculateOverallRiskRating();
}

onDropdownChangeImpact(value: any): void {
  this.impactValue = value ? parseFloat(value.target.value) : 0;
  this.calculateOverallRiskRating();
}

calculateOverallRiskRating(){
  if(this.likelihoodValue !=0 && this.impactValue !=0){
    this.result=this.likelihoodValue * this.impactValue
  }
  this.riskFactor=this.result
}

changeColorOverallRiskRating(){
  if(this.result<30){
    return '#6DA34D';
  }
  if(this.result>31 && this.result<99){
    return '#FFC107'
  }
  else{
    return '#D9534F'
  }
}

ngOnInit(){
  console.log(this.riskTypeValue);
  this.api.getLikelyHoodDefinition().subscribe((res:any)=>{
    this.dropdownDataLikelihood=res;
  })
  this.api.getImpactDefinition().subscribe((res:any)=>{
    this.dropdownDataImpact=res
  })
  this.api.getProjects(this.department).subscribe((res:any)=>{
    this.dropdownDataProject=res
  })

}

onSubmit(){
  const formValue = this.qmsForm.value;
  const payload = {
    riskId:this.riskId ,
    riskName: formValue.riskName ,
    description: formValue.description,
    riskType:this.riskTypeValue ,
    impact: formValue.impact ,
    mitigation: formValue.mitigation,
    contingency: formValue.contingency || null,
    overallRiskRating:this.result ,
    responsibleUserId: formValue.responsibileUserId,
    plannedActionDate: formValue.plannedActionDate ,
    departmentId: formValue.DepartmentId,
    projectId: formValue.projectId ? +formValue.projectId : null,
    riskAssessments: [
      {
        likelihood: formValue.likelihood ,
        impact: formValue.impactValue ,
        isMitigated: false,
        assessmentBasisId:null,
        riskFactor:this.riskFactor ,
        review: {
          userId: formValue.reviewerId ? +formValue.reviewerId : null,
          externalReviewerId:null,
          comments:null,
          reviewStatus:1,
        },
      },
    ],
  };
  this.api.addnewQualityRisk(payload).subscribe(res=>{
    console.log(res);
  })

  console.log("api for add is ",payload);



}
}

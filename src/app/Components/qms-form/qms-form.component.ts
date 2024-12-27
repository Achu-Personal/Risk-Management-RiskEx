import { Router } from '@angular/router';
import { Component, EventEmitter, input, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { ButtonComponent } from "../../UI/button/button.component";
import { CommonModule } from '@angular/common';
import { TextareaComponent } from "../../UI/textarea/textarea.component";
import { OverallRatingCardComponent } from "../../UI/overall-rating-card/overall-rating-card.component";
import { BodyContainerComponent } from "../body-container/body-container.component";


@Component({
  selector: 'app-qms-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, DropdownComponent, ButtonComponent, CommonModule, TextareaComponent, OverallRatingCardComponent, BodyContainerComponent],
  templateUrl: './qms-form.component.html',
  styleUrl: './qms-form.component.scss'
})
export class QMSFormComponent {

@Input() riskTypeValue: string=''
result: number = 0;
reviewerNotInList:boolean=false
assigneeNotInList:boolean=false
isAdmin:string='admin'
likelihoodValue:number=0
impactValue:number=0
riskFactor:number=0


qmsForm=new FormGroup({
  riskType:new FormControl(''),
  riskName:new FormControl('',Validators.required),
  description:new FormControl('',[Validators.maxLength(1000),Validators.minLength(15),Validators.required]),
  riskImpact:new FormControl('',[Validators.maxLength(1000),Validators.minLength(15),Validators.required]),
  projectId:new FormControl(''),
  likelihood:new FormControl('',Validators.required),
  impact:new FormControl('',Validators.required),
  mitigation:new FormControl('',[Validators.maxLength(1000),Validators.minLength(15),Validators.required]),
  contingency:new FormControl(''),
  responsibilityOfAction:new FormControl('',[Validators.maxLength(20),Validators.minLength(5),Validators.required]),
  plannedActionDate:new FormControl('',Validators.required),
  reviewer:new FormControl('',Validators.required)
})

dropdownDataLikelihood=[
  { "type":"Select Likelihood","value":""},
  {"type":"Low","value":"0.1"},
  {"type":"Medium","value":"0.2"},
  { "type":"High","value":"0.4"},
  { "type":"Critical","value":"0.6"}
];

dropdownDataImpact=[
  { "type":"select Impact","value":""},
  {"type":"Low","value":"10"},
  {"type":"Medium","value":"20"},
  { "type":"High","value":"40"},
  { "type":"Critical","value":"80"}
];

dropdownDataReviewer=[
  {"name":"Select--","email":""},
  {"name":"Achu s nair","email":"123"},
  {"name":"Shamna Sherin","email":"123"},
  {"name":"Deepak Denny","email":"123"},
  { "name":"Bindhya C Philip","email":"123"},
  { "name":"Vivek V N","email":"123"},
];

dropdownDataProject=[
  {"name":"Select--","id":""},
  {"name":"japanese training","id":"p12-34"},
  {"name":"risk management","id":"p-34-56"},
  {"name":"pit-stop","id":"p34-54"},
  { "name":"query management","id":"p01-01"},
  { "name":"HR inventory","id":"p03-3"},
];

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


}

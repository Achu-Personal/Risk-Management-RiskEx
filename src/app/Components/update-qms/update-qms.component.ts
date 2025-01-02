import { Component, Input } from '@angular/core';
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-qms',
  standalone: true,
  imports: [DropdownComponent,FormsModule,CommonModule],
  templateUrl: './update-qms.component.html',
  styleUrl: './update-qms.component.scss'
})
export class UpdateQmsComponent {
@Input() riskTypeValue: string=''
result: number = 0;
reviewerNotInList:boolean=false
assigneeNotInList:boolean=false
isAdmin:string='admin'
likelihoodValue:number=0
impactValue:number=0
riskFactor:number=0
selectedResponse: string = '';


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

riskResponses = [
{ id: 1, label: "Avoid" },
{ id: 2, label: "Mitigate" },
{ id: 3, label: "Transfer" },
{ id: 4, label: "Accept" }
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

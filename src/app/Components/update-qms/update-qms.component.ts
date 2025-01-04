import { Component, Input } from '@angular/core';
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';


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
departmentName:string=''
departmentId:string='';
dropdownDataLikelihood: any[] = []
dropdownDataImpact:any[]=[]
dropdownDataProject:any[]=[]
dropdownDataDepartment:any[]=[]
dropdownDataassignee:any[]=[]
dropdownDataReviewer: Array<{ id: number; fullName: string; email: string; type: string }> = [];
// riskResponses:Array<{ id: number; name: string; description: string; example: string; risks:string }> = [];
riskResponses:any[]=[]



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

onDropdownChangelikelihood(event: any): void {
  const selectedFactorId = Number(event.target.value);
  const selectedFactor = this.dropdownDataLikelihood.find(factor => Number(factor.id) === selectedFactorId);
  if (selectedFactor) {
    this.likelihoodValue = selectedFactor.likelihood;
    console.log('Selected Likelihood:', this.likelihoodValue);
  } else {
    console.log('Selected factor not found.');
  }
 this.calculateOverallRiskRating();
}

onDropdownChangeImpact(event: any): void {
 const selectedFactorId = Number(event.target.value);
 const selectedFactor = this.dropdownDataImpact.find(factor => Number(factor.id) === selectedFactorId);
 if (selectedFactor) {
  this.impactValue = selectedFactor.impact;
  console.log('Selected Impact:',this.impactValue);
 }else {
  console.log('Selected factor not found.');
 }
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

constructor(private api:ApiService,public authService:AuthService){}

ngOnInit(){

  console.log('selecetd risk type value',this.riskTypeValue);
  this.departmentName =this.authService.getDepartmentName()!;
  console.log('department Name',this.departmentName);
  this.departmentId=this.authService.getDepartmentId()!;
  console.log('department id',this.departmentId)
  this.api.getLikelyHoodDefinition().subscribe((res:any)=>{
    this.dropdownDataLikelihood=res;
  })
  this.api.getImpactDefinition().subscribe((res:any)=>{
    this.dropdownDataImpact=res
  })
  this.api.getProjects(this.departmentName).subscribe((res:any)=>{
    this.dropdownDataProject=res
  })
  this.api.getDepartment().subscribe((res:any)=>{
    this.dropdownDataDepartment=res
  })
  this.api.getAllReviewer().subscribe((res:any)=>{
    this.dropdownDataReviewer=res.reviewers
  })
  this.api.getAllUsersByDepartmentName(this.departmentName).subscribe((res:any)=>{
    this.dropdownDataassignee=res
  })
  this.api.getRiskResponses().subscribe((res:any)=>{
    this.riskResponses=res
    console.log(this.riskResponses)

  })


}


}

import { Component,Input} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { ButtonComponent } from "../../UI/button/button.component";
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { TextareaComponent } from "../../UI/textarea/textarea.component";
import { OverallRatingCardComponent } from "../../UI/overall-rating-card/overall-rating-card.component";
import { CommonModule } from '@angular/common';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';


@Component({
  selector: 'app-isms-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ButtonComponent, DropdownComponent, TextareaComponent, OverallRatingCardComponent,CommonModule],
  templateUrl: './isms-form.component.html',
  styleUrl: './isms-form.component.scss'
})
export class ISMSFormComponent {

@Input() riskTypeValue: number=0
result: number = 0;
reviewerNotInList:boolean=false
assigneeNotInList:boolean=false
confidentialityRiskFactor:number=0
integrityRiskFactor:number=0
availabilityRiskFactor:number=0
privacyRiskFactor:number=0
confidentialityLikelihoodValue:number=0
confidentialityImpactValue:number=0
integrityLikelihoodValue:number=0
integrityImpactValue:number=0
availabilityLikelihoodValue:number=0
availabilityImpactValue:number=0
privacyLikelihoodValue:number=0
privacyImpactValue:number=0
riskId:string='sfm_003'
dropdownDataLikelihood: any[] = []
dropdownDataImpact:any[]=[]
dropdownDataProject:any[]=[]
dropdownDataDepartment:any[]=[]
dropdownDataassignee:any[]=[]
dropdownDataReviewer: Array<{ id: number; fullName: string; email: string; type: string }> = [];
departmentId:string='';
showDialog = false;
externalReviewerId:number=0
departmentName:string=''
newAssigneeId:number=0
isInternal:boolean=true


constructor(private api:ApiService,public authService:AuthService){}

ismsForm=new FormGroup({
  riskName:new FormControl('',Validators.required),
  description:new FormControl('',[Validators.maxLength(1000),Validators.minLength(15),Validators.required]),
  impact:new FormControl('',[Validators.maxLength(1000),Validators.minLength(15),Validators.required]),
  projectId:new FormControl(''),
  confidentialityLikelihood:new FormControl('',Validators.required),
  confidentialityImpactValue:new FormControl('',Validators.required),
  integrityLikelihood:new FormControl('',Validators.required),
  integrityImpactValue:new FormControl('',Validators.required),
  privacyLikelihood:new FormControl('',Validators.required),
  privacyImpactValue:new FormControl('',Validators.required),
  availabilityLikelihood:new FormControl('',Validators.required),
  availabilityImpactValue:new FormControl('',Validators.required),
  mitigation:new FormControl('',[Validators.maxLength(1000),Validators.minLength(15),Validators.required]),
  contingency:new FormControl(''),
  responsibileUserId:new FormControl('',[Validators.maxLength(20),Validators.minLength(5),Validators.required]),
  plannedActionDate:new FormControl('',Validators.required),
  reviewerId:new FormControl('',Validators.required),
  DepartmentId:new FormControl(''),
  userId:new FormControl(''),
  externalReviewerId:new FormControl(''),
})

reviewerGroup= new FormGroup({
  fullName:new FormControl(''),
  email:new FormControl(''),
  departmentId:new FormControl('')
})

assigneeGroup=new FormGroup({
  fullName:new FormControl(''),
  email:new FormControl(''),
  departmentName:new FormControl('')

})

// dropdownDataReviewer=[
//   {"name":"Select--","email":""},
//   {"name":"Achu s nair","email":"1"},
//   {"name":"Shamna Sherin","email":"2"},
//   {"name":"Deepak Denny","email":"3"},
//   { "name":"Bindhya C Philip","email":"4"},
//   { "name":"Vivek V N","email":"5"},
// ];



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

onDropdownChange(event: any, type: string, category: string): void {
  const selectedFactorId = Number(event.target.value);
 const selectedFactorImpact = this.dropdownDataImpact.find(factor => Number(factor.id) === selectedFactorId);
 const selectedFactorLikelihood = this.dropdownDataLikelihood.find(factor => Number(factor.id) === selectedFactorId);

  switch (category) {
    case 'Confidentiality':
      if (type === 'Likelihood') {
        this.confidentialityLikelihoodValue = selectedFactorLikelihood.likelihood;
      } else if (type === 'Impact') {
        this.confidentialityImpactValue = selectedFactorImpact.impact;
      }
      this.calculateRiskFactor('Confidentiality');
      break;

    case 'Integrity':
      if (type === 'Likelihood') {
        this.integrityLikelihoodValue = selectedFactorLikelihood.likelihood;
      } else if (type === 'Impact') {
        this.integrityImpactValue = selectedFactorImpact.impact;
      }
      this.calculateRiskFactor('Integrity');
      break;

    case 'Availability':
      if (type === 'Likelihood') {
        this.availabilityLikelihoodValue = selectedFactorLikelihood.likelihood;
      } else if (type === 'Impact') {
        this.availabilityImpactValue = selectedFactorImpact.impact;
      }
      this.calculateRiskFactor('Availability');
      break;

    case 'Privacy':
      if (type === 'Likelihood') {
        this.privacyLikelihoodValue = selectedFactorLikelihood.likelihood;
      } else if (type === 'Impact') {
        this.privacyImpactValue = selectedFactorImpact.impact;
      }
      this.calculateRiskFactor('Privacy');
      break;
  }
}

calculateRiskFactor(category: string): void {
  switch (category) {
    case 'Confidentiality':
      this.confidentialityRiskFactor = this.confidentialityLikelihoodValue * this.confidentialityImpactValue;
      break;

    case 'Integrity':
      this.integrityRiskFactor = this.integrityLikelihoodValue * this.integrityImpactValue;
      break;

    case 'Availability':
      this.availabilityRiskFactor = this.availabilityLikelihoodValue * this.availabilityImpactValue;
      break;

    case 'Privacy':
      this.privacyRiskFactor = this.privacyLikelihoodValue * this.privacyImpactValue;
      break;
  }
  if(this.confidentialityRiskFactor !=0 && this.integrityRiskFactor !=0 && this.availabilityRiskFactor !=0 && this.privacyRiskFactor !=0){

    this.result= this.confidentialityRiskFactor + this.integrityRiskFactor + this.availabilityRiskFactor + this.privacyRiskFactor
  }
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
}

onSubmit(){

  const formValue = this.ismsForm.value; // Access form values
  const payload = {
    riskId: this.riskId,
    riskName: formValue.riskName,
    description: formValue.description,
    riskType: this.riskTypeValue,
    impact: formValue.impact,
    mitigation: formValue.mitigation,
    contingency: formValue.contingency || " ",
    overallRiskRating: Number(this.result),
    responsibleUserId: Number(formValue.responsibileUserId),
    plannedActionDate: `${formValue.plannedActionDate}T00:00:00.000Z`,
    departmentId: formValue.DepartmentId
      ? Number(formValue.DepartmentId)
      : Number(this.departmentId),
    projectId: formValue.projectId ? Number(formValue.projectId) : null,
    riskAssessments: [
      {
        likelihood: Number(formValue.confidentialityLikelihood),
        impact: Number(formValue.confidentialityImpactValue),
        isMitigated: false,
        assessmentBasisId: 1, // Example ID; replace if dynamic
        riskFactor: this.confidentialityRiskFactor,
        review: {
          userId: this.isInternal && formValue.reviewerId?formValue.reviewerId : null,
          externalReviewerId:!this.isInternal?formValue.reviewerId: this.externalReviewerId!=0 ? this.externalReviewerId: null,
          comments: " ",
          reviewStatus: 1,
        },
      },
      {
        likelihood: Number(formValue.integrityLikelihood),
        impact: Number(formValue.integrityImpactValue),
        isMitigated: false,
        assessmentBasisId: 2, // Example ID; replace if dynamic
        riskFactor: this.integrityRiskFactor,
        review: {
          userId: this.isInternal && formValue.reviewerId?formValue.reviewerId : null,
          externalReviewerId:!this.isInternal?formValue.reviewerId: this.externalReviewerId!=0 ? this.externalReviewerId: null,
          comments: " ",
          reviewStatus: 1,
        },
      },
      {
        likelihood: Number(formValue.availabilityLikelihood),
        impact: Number(formValue.availabilityImpactValue),
        isMitigated: false,
        assessmentBasisId: 3, // Example ID; replace if dynamic
        riskFactor: this.availabilityRiskFactor,
        review: {
          userId: this.isInternal && formValue.reviewerId?formValue.reviewerId : null,
          externalReviewerId:!this.isInternal?formValue.reviewerId: this.externalReviewerId!=0 ? this.externalReviewerId: null,
          comments: " ",
          reviewStatus: 1,
        },
      },
      {
        likelihood: Number(formValue.privacyLikelihood),
        impact: Number(formValue.privacyImpactValue),
        isMitigated: false,
        assessmentBasisId: 4, // Example ID; replace if dynamic
        riskFactor: this.privacyRiskFactor,
        review: {
          userId: this.isInternal && formValue.reviewerId?formValue.reviewerId : null,
          externalReviewerId:!this.isInternal?formValue.reviewerId: this.externalReviewerId!=0 ? this.externalReviewerId: null,
          comments: " ",
          reviewStatus: 1,
        },
      },
    ],
  };
  this.api.addnewSecurityOrPrivacyRisk(payload).subscribe(res=>{
    console.log(res);
  })
  console.log(payload);

}


openConfirmationDialog() {
  this.showDialog = true;
}

closeDialog() {
  this.showDialog = false;
}

onConfirm() {
  this.showDialog = false;
  this.onSubmit();
}

onCancel() {
  console.log('Submission canceled.');
}

onClear() {
  this.ismsForm.reset();
  console.log('Form cleared.');
}


saveExternalReviewer(){
  console.log(this.reviewerGroup);

  this.api.addExternalReviewer(this.reviewerGroup.value).subscribe((res:any)=>{
    this.externalReviewerId = res.reviewerId
    console.log("reviewer response",this.externalReviewerId);

  })
  this.isReviewerNotInList();

}

saveAssignee(){
  const formValue = this.assigneeGroup.value;
  const payload = {
    email:formValue.email,
    fullName:formValue.fullName,
    departmentName:this.departmentName
  }
  console.log(payload)
  this.api.addResponsiblePerson(payload).subscribe((res:any)=>{
    this.newAssigneeId=res.id
    console.log("new assignee id: ",this.newAssigneeId)
  })


}

onReviewerChange(selectedReviewer: any) {
  const selectedreviewer = Number(selectedReviewer.target.value);
  console.log("selected factor id is ",selectedreviewer);

  const selectedFactor = this.dropdownDataReviewer.find(factor => factor.id === selectedreviewer);
  console.log("selected factor is ",selectedFactor)
  if(selectedFactor){
    if (selectedFactor.type ==="Internal") {
      this.isInternal=true
      console.log("this is a internal reviewer",this.isInternal);

    } else if (selectedFactor.type ==="External") {
     this.isInternal=false
     console.log("this is a external reviewer",this.isInternal);
    }
  }

  else {
    console.error("No matching reviewer found for the selected ID.");
  }
}






}

import { ChangeDetectorRef, Component, Input} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { ButtonComponent } from "../../UI/button/button.component";
import { CommonModule } from '@angular/common';
import { TextareaComponent } from "../../UI/textarea/textarea.component";
import { OverallRatingCardComponent } from "../../UI/overall-rating-card/overall-rating-card.component";
import { BodyContainerComponent } from "../body-container/body-container.component";
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';
import { HeatmapComponent } from '../heatmap/heatmap.component';


@Component({
  selector: 'app-qms-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, DropdownComponent, ButtonComponent, CommonModule, TextareaComponent, OverallRatingCardComponent, BodyContainerComponent,HeatmapComponent],
  templateUrl: './qms-form.component.html',
  styleUrl: './qms-form.component.scss'
})
export class QMSFormComponent {
  @Input() riskIdFromParent: number=0;

@Input() riskTypeValue: number=1
result: number = 0;
reviewerNotInList:boolean=false
assigneeNotInList:boolean=false
likelihoodValue:number=0
impactValue:number=0
riskFactor:number=0
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
showReference =false
showDialogSuccess=false
dialogMessage:string=''
isEditMode = false;


showNotification = false;
  isSuccess = false;
  notificationMessage = '';
constructor(private api:ApiService,public authService:AuthService,private cdr: ChangeDetectorRef){}

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
  this.api.getAllUsers().subscribe((res:any)=>{
    this.dropdownDataassignee=res
  })


  if(this.riskIdFromParent!=0){
    this.isEditMode = true;
    this.api.getRiskById(this.riskIdFromParent).subscribe((res:any)=>{
      console.log("this is the id from the parent",this.riskIdFromParent)
      console.log("this is the data from that id",res)
      const formattedPlannedActionDate = this.formatDate(res.plannedActionDate);

      this.qmsForm.patchValue({
        riskName: res.riskName,
        description: res.description,
        impact: res.impact,
        projectId: res.projectId,
        likelihood: res.riskAssessments[0]?.likelihood,
        impactValue: res.riskAssessments[0]?.impact,
        mitigation: res.mitigation,
        contingency: res.contingency,
        responsibileUserId: res.responsibleUserId,
        plannedActionDate: formattedPlannedActionDate, // Remove time if present
        reviewerId: res.riskAssessments[0]?.review?.userId
          ? res.riskAssessments[0]?.review?.userId
          : res.riskAssessments[0]?.review?.externalReviewerId,
        DepartmentId: res.departmentId,
        userId: res.userId,
        externalReviewerId: res.riskAssessments[0]?.review?.externalReviewerId,
      });
    })
  }
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
    contingency: formValue.contingency || " ",
    overallRiskRating:Number(this.result) ,
    responsibleUserId:formValue.responsibileUserId? Number(formValue.responsibileUserId):this.newAssigneeId,
    plannedActionDate: `${formValue.plannedActionDate}T00:00:00.000Z` ,
    departmentId:formValue.DepartmentId? + Number(formValue.DepartmentId) : Number(this.departmentId),
    projectId: formValue.projectId ? +Number(formValue.projectId) : null,
    riskAssessments: [
      {
        likelihood: Number(formValue.likelihood) ,
        impact: Number(formValue.impactValue) ,
        isMitigated: false,
        assessmentBasisId:null,
        riskFactor:this.riskFactor ,
        review: {
          userId: this.isInternal && formValue.reviewerId?formValue.reviewerId : null,
          externalReviewerId:!this.isInternal?formValue.reviewerId: this.externalReviewerId!=0 ? this.externalReviewerId: null,
          comments:" ",
          reviewStatus:1,
        },
      },
    ],
  };
  if(!this.isEditMode){
    this.api.addnewQualityRisk(payload).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.id && res.id !== 0) { // Assuming API returns a success property
          this.isSuccess = true;
          this.notificationMessage = 'Risk successfully submitted!';
          // this.showNotification = true;
          // this.showDialog=false
        } else {
          this.isSuccess = false;
          this.notificationMessage = 'Failed to submit risk. Please try again.';
          // this.showNotification = true;
          // this.showDialog=false
        }
        this.showNotification = true;
        this.showDialog = false;
        this.cdr.detectChanges();

      },
      error: (error) => {
        console.error('Error:', error);
        this.isSuccess = false;
        this.notificationMessage = 'An error occurred while submitting the risk.';
        this.showNotification = true;
        this.showDialog=false

        this.cdr.detectChanges();
      }

    });

  }
  else{
    this.api.editQualityRisk(this.riskIdFromParent,payload).subscribe((res:any)=>{
      console.log(res)
    })

  }

}

formatDate(date: string): string {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Ensure two digits for month
  const day = ('0' + dateObj.getDate()).slice(-2); // Ensure two digits for day
  return `${year}-${month}-${day}`;
}

closeDialogSuccess() {
  this.showNotification = false;
  this.showDialog=false
}

openConfirmationDialog() {
  this.showDialog = true;
  this.cdr.detectChanges();
}

closeDialog() {
  this.showDialog = false;
}

onConfirm() {
  this.showDialog = false;
  this.onSubmit();
}

onCancel() {
  this.showDialog = false;
    this.notificationMessage = 'Submission canceled.';
    this.showNotification = true;
    this.cdr.detectChanges();
}

onClear() {
  this.qmsForm.reset();
  console.log('Form cleared.');
}

saveExternalReviewer(){
  console.log(this.reviewerGroup);

  this.api.addExternalReviewer(this.reviewerGroup.value).subscribe((res:any)=>{
    this.externalReviewerId = res.reviewerId
    console.log("reviewer response",this.externalReviewerId);

  })

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




  onReferenceClick(){
    this.showReference=!this.showReference
  }


}

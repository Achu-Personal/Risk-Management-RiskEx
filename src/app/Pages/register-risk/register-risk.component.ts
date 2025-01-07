import { ChangeDetectorRef, Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { QMSFormComponent } from "../../Components/qms-form/qms-form.component";
import { ISMSFormComponent } from "../../Components/isms-form/isms-form.component";
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { EmailService } from '../../Services/email.service';



@Component({
  selector: 'app-register-risk',
  standalone: true,
  imports: [BodyContainerComponent, QMSFormComponent, ISMSFormComponent,CommonModule],
  templateUrl: './register-risk.component.html',
  styleUrl: './register-risk.component.scss'
})
export class RegisterRiskComponent {
reviewer: any;

constructor(private api:ApiService,public authService:AuthService,private cdRef: ChangeDetectorRef,public email:EmailService){}
bgColor:string=''
selectedRiskType: number = 1;
departmentName:string=''
departmentId:string='';
isAdmin:string=''
dropdownDataLikelihood: any[] = []
dropdownDataImpact:any[]=[]
dropdownDataProject:any[]=[]
dropdownDataDepartment:any[]=[]
dropdownDataAssignee:any[]=[]
dropdownDataReviewer: Array<{ id: number; fullName: string; email: string; type: string }> = [];
context:any;
ngOnInit(){
  this.departmentName =this.authService.getDepartmentName()!;

  this.departmentId=this.authService.getDepartmentId()!;

  this.isAdmin=this.authService.getUserRole()!;
  console.log(this.isAdmin);


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

  this.api.getAllUsersByDepartmentId(Number(this.departmentId)).subscribe((res:any)=>{
    this.dropdownDataAssignee=res
  })

}

riskTypes=[
 { "type": "Quality","value": 1 },
 { "type": "Security","value": 2 },
 { "type": "Privacy","value": 3 }
];

setRiskType(riskValue: number){
  this.selectedRiskType = riskValue;
}


onFormSubmit(payload: any) {
  console.log('Payload received from child:', payload);
  if (payload.riskType == 1) {
    // this.api.addnewQualityRisk(payload).subscribe((res:any)=>{
    //   console.log(res);
    //   console.log("id:",res.id);
    //   this.api.getRevieverDetails(res.id).subscribe((r:any)=>{
        
        
    //     this.reviewer=r.fullName;
    //     console.log("REVIEWER:",this.reviewer);  
    //     const context = {
    //       responsibleUser: this.reviewer,
    //       riskId: res.riskId,
    //       riskName: res.riskName,
    //       description: res.description,
    //       riskType:res.riskType,
    //       plannedActionDate:res.plannedActionDate,
    //       overallRiskRating:res.overallRiskRatingBefore,

    //     };
    //     console.log("context:",context);
    //     this.email.sendAssigneeEmail(r.email,context).subscribe({
          
          
    //       next: () => {
    //         console.log('reviewer email:',r.email)
    //         console.log('context:',context);
            
    //         console.log('reviewer email sent successfully');
            
    //       },
    //       error: (emailError) => {
    //         console.error('Failed to send email to reviewer:', emailError);
          
    //       }
    //     })
        
    //   });

    // })
    this.api.addnewQualityRisk(payload).subscribe({
      next: (res: any) => {
        console.log('Risk saved successfully:', res);
        console.log('Generated Risk ID:', res.id);

        // Fetch reviewer details
        this.api.getRevieverDetails(res.id).subscribe({
          next: (r: any) => {
            this.reviewer = r[0].fullName;
            console.log('Reviewer Details:', this.reviewer);

             this.context = {
              responsibleUser: this.reviewer,
              riskId: res.riskId,
              riskName: res.riskName,
              description: res.description,
              riskType: res.riskType,
              plannedActionDate: res.plannedActionDate,
              overallRiskRating: res.overallRiskRatingBefore,
              id:res.id
            };
            console.log('Email Context:', this.context);

            // Send email to reviewer
            this.email.sendReviewerEmail(r[0].email, this.context).subscribe({
              next: () => {
                console.log('Reviewer Email:', r.email);
                console.log('Email Sent Successfully.');
              },
              error: (emailError) => {
                console.error('Failed to send email to reviewer:', emailError);
              },
            });
          },
          error: (reviewerError) => {
            console.error('Failed to fetch reviewer details:', reviewerError);
          },
        });
      },
      error: (saveError) => {
        console.error('Failed to save risk:', saveError);
      },
    });
  
    
  }
  else if (payload.riskType == 2) {
    this.api.addnewSecurityOrPrivacyRisk(payload).subscribe((res:any)=>{
      console.log(res);
    })
  }
  else{
    this.api.addnewSecurityOrPrivacyRisk(payload).subscribe((res:any)=>{
      console.log(res);
    })

  }

}

getRiskTypeClass() {
  if (this.selectedRiskType === 1) {
    this.bgColor="var(--quality-color)"
    return 'risk-type-1';
  } else if (this.selectedRiskType === 2) {
    this.bgColor="var(--security-color)"
    return 'risk-type-2';
  } else if (this.selectedRiskType === 3) {
    this.bgColor="var(--privacy-color)"
    return 'risk-type-3';
  }
  return ''; // Default or no class
}
}

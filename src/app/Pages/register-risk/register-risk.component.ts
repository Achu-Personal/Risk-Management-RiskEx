import { ChangeDetectorRef, Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { QMSFormComponent } from "../../Components/qms-form/qms-form.component";
import { ISMSFormComponent } from "../../Components/isms-form/isms-form.component";
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-register-risk',
  standalone: true,
  imports: [BodyContainerComponent, QMSFormComponent, ISMSFormComponent,CommonModule],
  templateUrl: './register-risk.component.html',
  styleUrl: './register-risk.component.scss'
})
export class RegisterRiskComponent {

constructor(private api:ApiService,public authService:AuthService,private cdRef: ChangeDetectorRef){}
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
    this.api.addnewQualityRisk(payload).subscribe((res:any)=>{
      console.log(res);

    })
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

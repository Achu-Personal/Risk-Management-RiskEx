import { Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { ReusableTableComponent } from "../../Components/reusable-table/reusable-table.component";
import { Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth/auth.service';

@Component({
  selector: 'app-draft-page',
  standalone: true,
  imports: [BodyContainerComponent, ReusableTableComponent],
  templateUrl: './draft-page.component.html',
  styleUrl: './draft-page.component.scss'
})
export class DraftPageComponent {
 isLoading = false;

  constructor(private router: Router,private api:ApiService,private auth:AuthService) {}

  OnClickRow(row:any): void {


    this.router.navigate([`/addrisk`],{queryParams:{id:row.riskId,riskType:row.riskType}});

    console.log("draftrowdata",row);

  }


headerData:any=[
  "riskId"," riskName","description","riskType","overallRiskRating",  "departmentName","responsibleUser","plannedActionDate","riskStatus",
];


headerDisplayMap: { [key: string]: string } = {

  riskId: "Risk Id",
  riskName: "Risk Name",
  description: "Description",
  riskType: "Risk Type",
  overallRiskRating: "CRR",
  departmentName:'Department ',
  responsibleUser:'Responsible User',

  plannedActionDate:"End Date",
  riskStatus: "Risk Status"
};

tableBody:any[]=[
  {
    riskId: '',
    riskName: '',
    description: '',
    riskType: '',
    overallRiskRating: 0,
    departmentName:"",
    responsibleUser:"",

    plannedActionDate: Date,
    riskStatus: '',
  },
]

ngOnInit()
{
    this.isLoading = true;
    if(this.auth.getUserRole()=="Admin"||this.auth.getUserRole()?.includes("EMTUser"))
    {
      this.headerData=[
        "riskId","riskName","description","riskType","overallRiskRating",  "departmentName","responsibleUser","plannedActionDate","riskStatus",
      ];

      this.tableBody=[
        {
          riskId: '',
          riskName: '',
          description: '',
          riskType: '',
          overallRiskRating: 0,
          departmentName:"",
          responsibleUser:"",
          plannedActionDate: Date,
          riskStatus: '',
        },
      ]
      this.api.getAllRisksAssigned().subscribe((e:any)=>{
        console.log("Risk assigned to a user=",e)
        this.tableBody=e;
        this.isLoading = false;

      })
    }
    else{

      this.headerData=[
        "riskId","riskName","description","riskType","overallRiskRating","plannedActionDate","riskStatus",
      ];

      this.tableBody=[
        {
          riskId: '',
          riskName: '',
          description: '',
          riskType: '',
          overallRiskRating: 0,
          plannedActionDate: Date,
          riskStatus: '',
        },
      ]
      this.api.getDraft(this.auth.getCurrentUserId()).subscribe((e:any)=>{

        this.tableBody=e;
        this.isLoading = false;


      })
    }

}
}

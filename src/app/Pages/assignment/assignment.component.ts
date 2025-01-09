import { department } from './../../Interfaces/deparments.interface';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { ReusableTableComponent } from "../../Components/reusable-table/reusable-table.component";
import { Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { AssignmentTable } from '../../Interfaces/assignment.interface';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-assignment',
  standalone: true,
  imports: [BodyContainerComponent, ReusableTableComponent],
  templateUrl: './assignment.component.html',
  styleUrl: './assignment.component.scss'
})
export class AssignmentComponent {
  isLoading = false;

  constructor(private router: Router,private api:ApiService,private auth:AuthService) {}

  OnClickRow(row:any): void {


    this.router.navigate([`/ViewRisk/${row.id}`]);
    console.log("rowdata",row);

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
  riskStatus: "Status"
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
        "riskId"," riskName","description","riskType","overallRiskRating",  "departmentName","responsibleUser","plannedActionDate","riskStatus",
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
        "riskId"," riskName","description","riskType","overallRiskRating","plannedActionDate","riskStatus",
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
      this.api.getRisksAssignedToUser(this.auth.getCurrentUserId()).subscribe((e:any)=>{
        console.log("Risk assigned to a user=",e)
        this.tableBody=e;
        this.isLoading = false;


      })
    }

}

}

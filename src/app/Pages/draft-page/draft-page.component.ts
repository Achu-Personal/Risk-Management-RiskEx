import { Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { ReusableTableComponent } from "../../Components/reusable-table/reusable-table.component";
import { Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth/auth.service';
import { DraftCardComponent } from "../../UI/draft-card/draft-card.component";

@Component({
  selector: 'app-draft-page',
  standalone: true,
  imports: [BodyContainerComponent, ReusableTableComponent, DraftCardComponent],
  templateUrl: './draft-page.component.html',
  styleUrl: './draft-page.component.scss'
})
export class DraftPageComponent {
 isLoading = false;

  constructor(private router: Router,private api:ApiService,private auth:AuthService) {}

  OnClickRow(row:any): void {


    this.router.navigate([`/addrisk`],{queryParams:{id:row.riskId,riskType:row.riskType}});// depart name or id

    console.log("draftrowdata",row);

  }


headerData:any=[
"riskName","description","riskType","overallRiskRating",  "departmentName","responsibleUser","plannedActionDate",
];


headerDisplayMap: { [key: string]: string } = {


  riskName: "Risk Name",
  description: "Description",
  riskType: "Risk Type",
  overallRiskRating: "CRR",
  departmentName:'Department ',
  responsibleUser:'Responsible User',

  plannedActionDate:"End Date",

};

tableBody:any[]=[
  {

    riskName: '',
    description: '',
    riskType: '',
    overallRiskRating: 0,
    departmentName:"",
    responsibleUser:"",

    plannedActionDate: Date,

  },
]

ngOnInit()
{
    this.isLoading = true;
    if(this.auth.getUserRole()=="Admin")
    {
      this.headerData=[
        "riskName","description","riskType","overallRiskRating",  "departmentName","responsibleUser","plannedActionDate","Action"
      ];

      this.tableBody=[
        {

          riskName: '',
          description: '',
          riskType: '',
          overallRiskRating: 0,
          departmentName:"",
          responsibleUser:"",
          plannedActionDate: Date,

        },
      ]



      this.api.getDraftOfAdmin().subscribe((e:any)=>{

        this.tableBody=e;
        console.log("draftdata",e);

        this.isLoading = false;
      })
    }
    else{

      this.headerData=[
        "riskName","description","riskType","overallRiskRating","plannedActionDate"
      ];

      this.tableBody=[
        {

          riskName: '',
          description: '',
          riskType: '',
          overallRiskRating: 0,
          plannedActionDate: Date,

        },
      ]



      this.api.getDraft(this.auth.getDepartmentId()).subscribe((e:any)=>{

        this.tableBody=e;
        this.isLoading = false;
      })

    }

}
}

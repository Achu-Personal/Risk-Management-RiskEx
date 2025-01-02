import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { ReusableTableComponent } from "../../Components/reusable-table/reusable-table.component";
import { Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { AssignmentTable } from '../../Interfaces/assignment.interface';

@Component({
  selector: 'app-assignment',
  standalone: true,
  imports: [BodyContainerComponent, ReusableTableComponent],
  templateUrl: './assignment.component.html',
  styleUrl: './assignment.component.scss'
})
export class AssignmentComponent {
  constructor(private router: Router,private api:ApiService) {}

  OnClickRow(row:any): void {


    this.router.navigate([`/ViewRisk/${row.id}`]);
    console.log("rowdata",row);

  }


headerData:any=[
  "riskId"," riskName","description","riskType","overallRiskRating","plannedActionDate","riskStatus",
];


headerDisplayMap: { [key: string]: string } = {
  riskId: "RiskId",
  riskName: "RiskName",
  description: "Description",
  riskType: "Risk Type",
  overallRiskRating: "CRR",
  plannedActionDate:"End Date",
  riskStatus: "RiskStatus"
};

tableBody:any[]=[
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

ngOnInit()
{
    this.api.getRisksAssignedToUser().subscribe((e:any)=>{
      console.log("Risk assigned to a user=",e)
      this.tableBody=e

    })
}

}

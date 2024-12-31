import { Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { approvalTableBody } from '../../Interfaces/approvalTable.interface';
import { ReusableTableComponent } from "../../Components/reusable-table/reusable-table.component";
import { Router, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../Components/confirm-dialog/confirm-dialog.component';
import { ApiService } from '../../Services/api.service';


@Component({
  selector: 'app-approval-table',
  standalone: true,
  imports: [BodyContainerComponent, ReusableTableComponent],
  templateUrl: './approval-table.component.html',
  styleUrl: './approval-table.component.scss'
})
export class ApprovalTableComponent {

  
headerData:any=['riskId', 'riskName', 'description', 'riskType', 'plannedActionDate', 'overallRiskRating', 'riskStatus'];
//"SI NO",
headerDisplayMap: { [key: string]: string } = {
  riskId: 'Risk ID',
  riskName: 'Risk Name',
  description: 'Description',
  riskType: 'Risk Type',
  plannedActionDate: 'Planned Action Date',
  overallRiskRating: 'Overall Risk Rating',
  riskStatus: 'Risk Status',
};

tableBody:any[]=[
  {

    riskId: '',
    riskName: '',
    description: '',
    riskType: '',
    plannedActionDate: Date,

        overallRiskRating: 0,
        riskStatus: ''
        
      },
];

  commentForm: any;
  isButtonClicked:boolean = false;
  cancelMessage: string = "";
  approveMessage: string = "";

  constructor( private dialog: MatDialog,private router: Router,private api:ApiService) {}


  ngOnInit(): void {
    this.api.getRisksByReviewerId().subscribe((response: any) => {
      console.log('API Response:', response);
  
      // Ensure `response` is an array
      if (Array.isArray(response)) {
        this.tableBody = response;
      } else {
        console.error('Expected an array but got:', response);
        this.tableBody = []; // Default to an empty array if the response is not valid
      }
  
      console.log('tableBody:', this.tableBody);
    });
  }
  
  OnClickRow(rowData:any): void {
    this.router.navigate([`/approvals/${rowData.RiskId}`]);
    console.log("rowdata",rowData);
    
  } 
 

approveRisk(rowData:any): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: { message: 'Are you sure you want to approve this risk?',
      rowData: rowData,
      // isCommentRequired: true,
     },
    width: '400px',
  });

  dialogRef.afterClosed().subscribe((result: any) => {
    if (result) {
      this.tableBody = this.tableBody.filter(row => row.RiskId !== rowData.RiskId);
      console.log('Risk approved!');
      this.approveMessage = 'Risk has been approved successfully.';
    } else {
      console.log('Approval canceled.');
    }
  });
}

// Open a confirmation dialog for rejecting a risk
rejectRisk(rowData:any): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: { message: 'Are you sure you want to reject this risk?',rowData: rowData },
    width: '400px',
  });

  dialogRef.afterClosed().subscribe((result: any) => {
    
    if (result) {
      this.tableBody = this.tableBody.filter(row => row.RiskId !== rowData.RiskId);
      console.log("tablebody",this.tableBody);
      
      console.log('Risk rejected!');
      this.cancelMessage = 'Risk has been rejected successfully.';
    } else {
      console.log('Rejection canceled.');
    }
  });
}

}

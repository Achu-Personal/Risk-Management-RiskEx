import { Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { approvalTableBody } from '../../Interfaces/approvalTable.interface';
import { ReusableTableComponent } from "../../Components/reusable-table/reusable-table.component";
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../Components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-approval-table',
  standalone: true,
  imports: [ BodyContainerComponent, ReusableTableComponent],
  templateUrl: './approval-table.component.html',
  styleUrl: './approval-table.component.scss'
})
export class ApprovalTableComponent {

  
headerData:any=[
  "SI NO"," RiskID","Risk","Description","EndDate","Type","Current Risk Rating","Status",
];

tableBody:approvalTableBody[]=[
  {
    SINo: 1,
    RiskId: 'R001',
    Risk: 'Inside Threat',
    Description: 'Potential unauthorized access to sensitive data.',
    EndDate: new Date('2024-12-31'),
    Type: 'Cybersecurity',
    CurrentRating: 8,
    Status: 'Pending'
    
  },
  {
    SINo: 2,
    RiskId: 'R002',
    Risk: 'Third Party Vendor Breach',
    Description: 'Critical application unavailability due to server failure.',
    EndDate: new Date('2024-11-30'),
    Type: 'Operational',
    CurrentRating: 7,
    Status: 'Pending'
    
  },
  {
    SINo: 3,
    RiskId: 'R003',
    Risk: 'Regulatory Compliance',
    Description: 'Non-compliance with new tax regulations.',
    EndDate: new Date('2024-10-15'),
    Type: 'Legal',
    CurrentRating: 5,
    Status: 'Pending'
    
  },
  {
    SINo: 4,
    RiskId: 'R004',
    Risk: 'Vendor Dependency',
    Description: 'Over-reliance on a single vendor for critical operations.',
    EndDate: new Date('2024-09-01'),
    Type: 'Strategic',
    CurrentRating: 6,
    Status: 'Pending'
    
  },
  {
    SINo: 5,
    RiskId: 'R005',
    Risk: 'Market Fluctuations',
    Description: 'Adverse impact on revenue due to market changes.',
    EndDate: new Date('2024-12-15'),
    Type: 'Financial',
    CurrentRating: 4,
    Status: 'Pending'
  }
];



  commentForm: any;
  isButtonClicked:boolean = false;
  cancelMessage: string = "";
  approveMessage: string = "";

  constructor( private dialog: MatDialog,private router: Router) {}


  OnClickRow(rowData:any): void {
    this.router.navigate([`/approvals/${rowData.RiskId}`]);
    console.log("rowdata",rowData);
    
  } 
 

approveRisk(rowData:any): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: { message: 'Are you sure you want to approve this risk?',
      rowData: rowData
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

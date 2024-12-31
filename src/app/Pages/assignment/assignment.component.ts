import { Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { ReusableTableComponent } from "../../Components/reusable-table/reusable-table.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-assignment',
  standalone: true,
  imports: [BodyContainerComponent, ReusableTableComponent],
  templateUrl: './assignment.component.html',
  styleUrl: './assignment.component.scss'
})
export class AssignmentComponent {
  constructor(private router: Router) {}
  
  OnClickRow(rowid:any): void {
    this.router.navigate([`/ViewRisk/${rowid}`]);
    console.log("rowdata",rowid);

  }
  
headerData:any=[
  "SI NO"," Risk Id","Risk","Description","End Date","Type","CRR","Status",
];

tableBody:any[]=[
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
  },
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


}

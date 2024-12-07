import { Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { approvalTableBody } from '../../Interfaces/approvalTable.interface';
import { ReusableTableComponent } from "../../Components/reusable-table/reusable-table.component";

@Component({
  selector: 'app-approval-table',
  standalone: true,
  imports: [ BodyContainerComponent, ReusableTableComponent],
  templateUrl: './approval-table.component.html',
  styleUrl: './approval-table.component.scss'
})
export class ApprovalTableComponent {
headerData:any=[
  "SI NO"," RiskID","Risk","Description","EndDate","Type","Current Risk Rating","Status","Actions"
];

tableBody:approvalTableBody[]=[
  {
    SINo: 1,
    RiskId: 'R001',
    Risk: 'Data Breach',
    Description: 'Potential unauthorized access to sensitive data.',
    EndDate: new Date('2024-12-31'),
    Type: 'Cybersecurity',
    CurrentRating: 8,
    Status: 'Active',
    Actions: 'Mitigation in Progress',
  },
  {
    SINo: 2,
    RiskId: 'R002',
    Risk: 'System Downtime',
    Description: 'Critical application unavailability due to server failure.',
    EndDate: new Date('2024-11-30'),
    Type: 'Operational',
    CurrentRating: 7,
    Status: 'Resolved',
    Actions: 'Upgraded server infrastructure',
  },
  {
    SINo: 3,
    RiskId: 'R003',
    Risk: 'Regulatory Compliance',
    Description: 'Non-compliance with new tax regulations.',
    EndDate: new Date('2024-10-15'),
    Type: 'Legal',
    CurrentRating: 5,
    Status: 'Pending Review',
    Actions: 'Internal audit in progress',
  },
  {
    SINo: 4,
    RiskId: 'R004',
    Risk: 'Vendor Dependency',
    Description: 'Over-reliance on a single vendor for critical operations.',
    EndDate: new Date('2024-09-01'),
    Type: 'Strategic',
    CurrentRating: 6,
    Status: 'Active',
    Actions: 'Identified alternative vendors',
  },
  {
    SINo: 5,
    RiskId: 'R005',
    Risk: 'Market Fluctuations',
    Description: 'Adverse impact on revenue due to market changes.',
    EndDate: new Date('2024-12-15'),
    Type: 'Financial',
    CurrentRating: 4,
    Status: 'Monitoring',
    Actions: 'Regular market analysis',
  },
];

}

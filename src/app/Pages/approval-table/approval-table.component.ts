import { Component } from '@angular/core';
import { BodyContainerComponent } from '../../Components/body-container/body-container.component';
import { ReusableTableComponent } from '../../Components/reusable-table/reusable-table.component';
import { Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-approval-table',
  standalone: true,
  imports: [BodyContainerComponent, ReusableTableComponent],
  templateUrl: './approval-table.component.html',
  styleUrl: './approval-table.component.scss',
})
export class ApprovalTableComponent {
  headerData: string[] = [];
  //"SI NO",
  headerDisplayMap: { [key: string]: string } = {
    riskId: 'Risk ID',
    riskName: 'Risk Name',
    description: 'Description',
    riskType: 'Risk Type',
    riskDepartment: 'Department',
    plannedActionDate: 'Planned Action Date',
    overallRiskRating: 'CRR',
    riskStatus: 'Risk Status',
    reviewerName: 'Reviewer',
    reviewerDepartment: 'Reviewer Department',
  };

  tableBodyAdmin: any[] = [
    {
      riskId: '',
      riskName: '',
      description: '',
      riskType: '',
      riskDepartment: 'N/A',
      plannedActionDate: Date,
      overallRiskRating: 0,
      riskStatus: '',
      reviewerName: 'N/A',
      reviewerDepartment: 'N/A',
    },
  ];
  tableBody: any[] = [
    {
      riskId: '',
      riskName: '',
      description: '',
      riskType: '',
      plannedActionDate: Date,
      overallRiskRating: 0,
      riskStatus: '',
    },
  ];

  commentForm: any;
  isButtonClicked: boolean = false;
  cancelMessage: string = '';
  approveMessage: string = '';
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private api: ApiService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    const role = this.auth.getUserRole(); // Fetch user role
    this.isAdmin = role === 'Admin';
    if (this.isAdmin) {
      this.headerData = [
        'riskId',
        'riskName',
        'description',
        'riskType',
        'riskDepartment',
        'plannedActionDate',
        'overallRiskRating',
        'riskStatus',
        'reviewerName',
        'reviewerDepartment',
      ];

      this.api.getAllRisksTobeReviewed().subscribe((response: any) => {
        this.tableBodyAdmin = response || [];
      });
    } else {
      this.headerData = [
        'riskId',
        'riskName',
        'description',
        'riskType',
        'plannedActionDate',
        'overallRiskRating',
        'riskStatus',
      ];
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
  }

  OnClickRow(rowData: any): void {
    this.router.navigate([`/approvals/${rowData.id}`]);
    console.log('rowdata', rowData);
  }


  showApproveDialog = false;
  showRejectDialog = false;
  selectedRow: any;

  approveRisk(event: {row: any, comment: string}) {
    console.log('Approved:', event.row);
    console.log('Comment:', event.comment);
  }

  rejectRisk(event: {row: any, comment: string}) {
    console.log('Rejected:', event.row);
    console.log('Comment:', event.comment);
  }
}

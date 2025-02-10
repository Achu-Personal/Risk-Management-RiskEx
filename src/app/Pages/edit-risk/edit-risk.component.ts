import { Component } from '@angular/core';
import { BodyContainerComponent } from '../../Components/body-container/body-container.component';
import { QmsEditComponent } from '../../Components/qms-edit/qms-edit.component';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';
import { IsmsEditComponent } from '../../Components/isms-edit/isms-edit.component';
import { CommonModule } from '@angular/common';
import { FormSuccessfullComponent } from '../../Components/form-successfull/form-successfull.component';
import { Router } from '@angular/router';
import { EmailService } from '../../Services/email.service';
import { FormLoaderComponent } from '../../Components/form-loader/form-loader.component';

@Component({
  selector: 'app-edit-risk',
  standalone: true,
  imports: [
    BodyContainerComponent,
    QmsEditComponent,
    IsmsEditComponent,
    CommonModule,
    FormSuccessfullComponent,
    FormLoaderComponent,
  ],
  templateUrl: './edit-risk.component.html',
  styleUrl: './edit-risk.component.scss',
})
export class EditRiskComponent {
  riskData: any = {};
  riskType: string = 'Quality';
  riskId: number = 0;

  bgColor: string = '';
  selectedRiskType: number = 1;
  departmentName: string = '';
  departmentId: string = '';
  isAdmin: string = '';
  dropdownDataLikelihood: any[] = [];
  dropdownDataImpact: any[] = [];
  dropdownDataProject: any[] = [];
  dropdownDataDepartment: any[] = [];
  dropdownDataAssignee: any[] = [];
  dropdownDataReviewer: Array<{
    id: number;
    fullName: string;
    email: string;
    type: string;
  }> = [];
  isSuccess: boolean = false;
  isError: boolean = false;
  error: string = '';
  isLoading = false; // Initially false

  constructor(
    private api: ApiService,
    public authService: AuthService,
    private router: Router,
    private email: EmailService
  ) {}

  ngOnInit() {
    this.riskData = history.state.riskData;
    this.riskId = this.riskData.id;
    this.riskType = this.riskData.riskType;
    if (this.riskType == 'Quality') {
      this.selectedRiskType = 1;
    }
    if (this.riskType == 'Security') {
      this.selectedRiskType = 2;
    }
    if (this.riskType == 'Privacy') {
      this.selectedRiskType = 3;
    }

    this.departmentName = this.authService.getDepartmentName()!;

    this.departmentId = this.authService.getDepartmentId()!;

    this.isAdmin = this.authService.getUserRole()!;
    console.log(this.isAdmin);

    this.api.getLikelyHoodDefinition().subscribe((res: any) => {
      this.dropdownDataLikelihood = res;
    });

    this.api.getImpactDefinition().subscribe((res: any) => {
      this.dropdownDataImpact = res;
    });

    this.api.getProjects(this.departmentName).subscribe((res: any) => {
      this.dropdownDataProject = res;
    });

    this.api.getDepartment().subscribe((res: any) => {
      this.dropdownDataDepartment = res;
    });

    this.api.getAllReviewer().subscribe((res: any) => {
      this.dropdownDataReviewer = res.reviewers;
    });

    const departmentId: any = this.authService.getDepartmentId();
    this.api.getUsersByDepartmentId(departmentId).subscribe((res: any) => {
      this.dropdownDataAssignee = res;
    });
  }

  onFormSubmit(payload: any) {
    this.isLoading = true;
    if (!payload || !payload.riskType || !this.riskId) {
      console.error('Invalid payload or missing risk ID.');
      alert(
        'Error: Missing required data. Please check the form and try again.'
      );
      this.error =
        'Error: Missing required data. Please check the form and try again.';
      return;
    }

    const riskId = Number(this.riskId);
    let apiCall;

    if (payload.riskType === 1) {
      apiCall = this.api.editQualityRisk(riskId, payload);
    } else if (payload.riskType === 2) {
      apiCall = this.api.editSecurityOrPrivacyRisk(riskId, payload);
    } else {
      console.warn(
        'Unknown risk type. Defaulting to Security or Privacy Risk.'
      );
      apiCall = this.api.editSecurityOrPrivacyRisk(riskId, payload);
    }

    apiCall.subscribe({
      next: (res: any) => {
        this.isLoading = false;
        console.log('Success Response:', res);

        console.log('SENDING EMAIL');

        this.isSuccess = true;
        this.sendEmailOnRegisterRisk(res.id, res);
      },
      error: (error: any) => {
        this.isError = true;
        this.isLoading = false;
        if (error.status === 404) {
          console.error(
            'Error 404: Resource not found. Check the risk ID or API endpoint.'
          );
          alert(
            'Error: The requested resource was not found (404). Please verify the data and try again.'
          );
          this.error =
            'Error: The requested resource was not found (404).<br> Please verify the data and try again.';
        } else if (error.status === 500) {
          console.error(
            'Error 500: Internal Server Error. Something went wrong on the server.'
          );
          alert(
            'Error: A server issue occurred (500). Please try again later.'
          );
          this.error =
            'Error: A server issue occurred (500).<br> Please try again later.';
        } else {
          console.error('Unexpected Error:', error);
          alert('An unexpected error occurred. Please try again.');
          this.error = 'An unexpected error occurred. Please try again.';
        }
      },
      complete: () => {
        console.log('API request completed successfully.');
      },
    });
  }

  closeDialog() {
    this.isSuccess = false;
    this.isError = false;
    this.router.navigate(['/home']);
  }

  sendEmailOnRegisterRisk(riskId: number, riskData: any) {
    console.log('before is submit:', this.isSuccess);
    if (this.isSuccess) {
      console.log('after is submit');
      // Fetch reviewer details
      this.api.getRevieverDetails(riskId, 'ReviewPending').subscribe({
        next: (r: any) => {
          const reviewer = r[0].fullName;
          console.log('Reviewer Details:', reviewer);

          const context = {
            responsibleUser: reviewer,
            riskId: riskData.riskId,
            riskName: riskData.riskName,
            description: riskData.description,
            riskType:
              riskData.riskType === 1
                ? 'Quality'
                : this.riskData.riskType === 2
                ? 'Security'
                : 'Privacy',
            impact: riskData.impact,
            mitigation: riskData.mitigation,
            plannedActionDate: new Date(
              riskData.plannedActionDate
            ).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            overallRiskRating: riskData.overallRiskRatingBefore,
            // reason:riskData.riskAssessments[0].review.comments,
            id: riskData.id,
            rid: riskData.id,
          };
          console.log('Email Context:', context);
          console.log('Reviewer Email:', r[0].email);

          // Send email to reviewer
          this.email.sendReviewerEmail(r[0].email, context).subscribe({
            next: () => {
              console.log('Reviewer Email:', r[0].email);
              console.log('Email Sent Successfully.');
            },
            error: (emailError) => {
              console.error('Failed to send email to reviewer:', emailError);
            },
          });
        },
        error: (reviewerError) => {
          console.error('Failed to fetch reviewer details:', reviewerError);
        },
      });
    }
  }
}

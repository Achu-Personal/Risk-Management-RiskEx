import { ChangeDetectorRef, Component } from '@angular/core';
import { BodyContainerComponent } from '../../Components/body-container/body-container.component';
import { ReusableTableComponent } from '../../Components/reusable-table/reusable-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth/auth.service';
import { EmailService } from '../../Services/email.service';
import { NotificationService } from '../../Services/notification.service';
import { FormLoaderComponent } from '../../Components/form-loader/form-loader.component';

@Component({
  selector: 'app-approval-table',
  standalone: true,
  imports: [
    BodyContainerComponent,
    ReusableTableComponent,
    FormLoaderComponent,
  ],
  templateUrl: './approval-table.component.html',
  styleUrl: './approval-table.component.scss',
})
export class ApprovalTableComponent {
  headerData: string[] = [];
  assignee: any;
  isLoading = false;
  isLoader = false;
  impact: string = '';
  mitigation: string = '';

  headerDisplayMap: { [key: string]: string } = {
    riskId: 'Risk ID',
    riskName: 'Risk Name',
    description: 'Description',
    riskType: 'Risk Type',
    riskDepartment: 'Department',
    departmentName: 'Department',
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
      departmentName: '',
      riskStatus: '',
    },
  ];

  commentForm: any;
  isButtonClicked: boolean = false;
  cancelMessage: string = '';
  approveMessage: string = '';
  isAdmin: boolean = false;
  isEMT = false;

  constructor(
    private router: Router,
    private api: ApiService,
    public auth: AuthService,
    private route: ActivatedRoute,
    public email: EmailService,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService
  ) { }

  private refreshTableDataAdmin() {
    this.isLoading = true;
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
    this.tableBodyAdmin = [
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

    this.api.getAllRisksTobeReviewed().subscribe((response: any) => {
      this.tableBodyAdmin = response;
      this.isLoading = false;
    });
  }

  private refershTableData() {
    this.isLoading = true;
    this.headerData = [
      'riskId',
      'riskName',
      'description',
      'riskType',
      'plannedActionDate',
      'overallRiskRating',
      'departmentName',
      'riskStatus',
    ];
    this.tableBody = [
      {
        riskId: '',
        riskName: '',
        description: '',
        riskType: '',
        plannedActionDate: Date,
        overallRiskRating: 0,
        departmentName: '',
        riskStatus: '',
      },
    ];
    this.api
      .getRisksByReviewerId(this.auth.getCurrentUserId())
      .subscribe((response: any) => {
        this.tableBody = response;
        this.isLoading = false;
      });
  }

  ngOnInit(): void {
    const role = this.auth.getUserRole();
    this.isAdmin = role === 'Admin';

    this.isLoading = true;
    if (this.isAdmin) {
      this.refreshTableDataAdmin();
    } else {
      this.refershTableData();
    }
  }

  OnClickRow(rowData: any): void {
    this.router.navigate([`approvals/${rowData.id}`]);
  }

  showApproveDialog = false;
  showRejectDialog = false;
  selectedRow: any;

  // NEW METHOD: Get email recipients and template based on risk status
  private getEmailRecipientsAndTemplate(riskStatus: string, res: any) {
    const config = {
      recipients: [] as string[],
      emailMethods: [] as string[],
      contexts: [] as any[]
    };

    switch (riskStatus.toLowerCase()) {
      case 'open':
        config.recipients = [res.responsibleUser.email, 'owner'];
        config.emailMethods = ['sendAssigneeEmail', 'sendApprovalEmail'];
        break;

      case 'undertreatment':
      case 'monitoring':
        config.recipients = [res.responsibleUser.email, 'owner'];
        config.emailMethods = ['sendStatusUpdateEmail', 'sendStatusUpdateEmail'];
        break;

      case 'accepted':
        config.recipients = ['owner', res.responsibleUser.email];
        config.emailMethods = ['sendRiskAcceptanceEmail', 'sendRiskAcceptanceEmail'];
        break;

      case 'deferred':
        config.recipients = [res.responsibleUser.email, 'owner'];
        config.emailMethods = ['sendRiskDeferredEmail', 'sendRiskDeferredEmail'];
        break;

      case 'close':
      case 'closed':
        config.recipients = [res.responsibleUser.email, 'owner'];
        config.emailMethods = ['sendRiskClosureEmail', 'sendRiskClosureEmail'];
        break;

      default:
        config.recipients = ['owner'];
        config.emailMethods = ['sendGeneralStatusEmail'];
    }

    return config;
  }

  // NEW METHOD: Send emails based on status
  private sendEmailsBasedOnStatus(res: any, baseContext: any, emailConfig: any, riskId: number) {
    let emailsSent = 0;
    const totalEmails = emailConfig.recipients.length;

    const checkEmailsComplete = () => {
      emailsSent++;
      if (emailsSent >= totalEmails) {
        this.isLoader = false;
        this.refershTableData();
        this.cdr.markForCheck();
      }
    };

    emailConfig.recipients.forEach((recipient: string, index: number) => {
      if (recipient === 'owner') {
        // Get owner email
        this.api.getriskOwnerEmailandName(riskId).subscribe({
          next: (ownerRes: any) => {
              const ownerContext = {
            ...baseContext,
            responsibleUser: ownerRes[0].name  // Override with owner's name
          };
            this.sendEmailByMethod(emailConfig.emailMethods[index], ownerRes[0].email, ownerContext);
            checkEmailsComplete();
          },
          error: (error) => {
            console.error('Failed to get risk owner details:', error);
            checkEmailsComplete();
          }
        });
      } else {
        // Direct email address
        this.sendEmailByMethod(emailConfig.emailMethods[index], recipient, baseContext);
        checkEmailsComplete();
      }
    });
  }

  // NEW METHOD: Route to appropriate email sending method
  private sendEmailByMethod(methodName: string, email: string, context: any) {
    switch (methodName) {
      case 'sendAssigneeEmail':
        this.email.sendAssigneeEmail(email, context).subscribe({
          next: () => console.log('Assignee email sent successfully'),
          error: (error) => console.error('Failed to send assignee email:', error)
        });
        break;
      case 'sendApprovalEmail':
        this.email.sendApprovalEmail(email, context).subscribe({
          next: () => console.log('Approval email sent successfully'),
          error: (error) => console.error('Failed to send approval email:', error)
        });
        break;
      case 'sendRiskClosureEmail':
        this.email.sendRiskClosureEmail(email, context).subscribe({
          next: () => console.log('Closure email sent successfully'),
          error: (error) => console.error('Failed to send closure email:', error)
        });
        break;
      case 'sendStatusUpdateEmail':
        this.email.sendStatusUpdateEmail(email, context).subscribe({
          next: () => console.log('Status update email sent successfully'),
          error: (error) => console.error('Failed to send status update email:', error)
        });
        break;
      case 'sendRiskAcceptanceEmail':
        this.email.sendRiskAcceptanceEmail(email, context).subscribe({
          next: () => console.log('Risk acceptance email sent successfully'),
          error: (error) => console.error('Failed to send risk acceptance email:', error)
        });
        break;
      case 'sendRiskDeferredEmail':
        this.email.sendRiskDeferredEmail(email, context).subscribe({
          next: () => console.log('Risk deferred email sent successfully'),
          error: (error) => console.error('Failed to send risk deferred email:', error)
        });
        break;
      default:
        this.email.sendGeneralStatusEmail(email, context).subscribe({
          next: () => console.log('General status email sent successfully'),
          error: (error) => console.error('Failed to send general status email:', error)
        });
    }
  }

  approveRisk(event: { row: any; comment: string }) {
    this.isLoader = true;
    const updates = {
      approvalStatus: 'Approved',
      comments: event.comment,
    };
    let id = event.row.id;

    this.api.getRiskById(id).subscribe(
      (riskDetails: any) => {
        this.impact = riskDetails.impact;
        this.mitigation = riskDetails.mitigation;

        let reviewToUpdate: number | null = null;
        let pendingReviewFound = false;

        for (const assessment of riskDetails.riskAssessments) {
          if (assessment.review && assessment.review.reviewStatus === "ReviewPending") {
            reviewToUpdate = assessment.review.id;
            pendingReviewFound = true;
            break;
          }
        }

        if (!pendingReviewFound) {
          if (event.row.riskStatus === 'closed') {
            let latestReview = null;
            let latestReviewId = 0;

            for (const assessment of riskDetails.riskAssessments) {
              if (assessment.review && assessment.review.id > latestReviewId) {
                latestReview = assessment.review;
                latestReviewId = assessment.review.id;
              }
            }

            reviewToUpdate = latestReview ? latestReview.id : null;
            if (!reviewToUpdate) {
              this.notification.error('No valid review found for this closed risk');
              this.isLoader = false;
              return;
            }
          } else {
            if (riskDetails.riskAssessments.length > 0) {
              for (let i = 0; i < riskDetails.riskAssessments.length; i++) {
                if (riskDetails.riskAssessments[i].review) {
                  reviewToUpdate = riskDetails.riskAssessments[i].review.id;
                  break;
                }
              }
            } else {
              this.notification.error('No assessments found for this risk');
              this.isLoader = false;
              return;
            }
          }
        }

        this.api.updateReviewStatusAndComments(id, { ...updates, reviewId: reviewToUpdate }).subscribe({
          next: () => {
            this.notification.success("The risk has been Approved successfully");

            // Get email configuration based on risk status
            const emailConfig = this.getEmailRecipientsAndTemplate(event.row.riskStatus, riskDetails);

            // Get assignee details
            this.api.getAssigneeByRiskId(id).subscribe({
              next: (assigneeRes: any) => {
                this.assignee = assigneeRes;

                // Prepare base context
                const baseContext = {
                  responsibleUser: this.assignee.fullName,
                  riskId: event.row.riskId,
                  riskName: event.row.riskName,
                  description: event.row.description,
                  riskType: event.row.riskType,
                  impact: this.impact,
                  mitigation: this.mitigation,
                  plannedActionDate: new Date(event.row.plannedActionDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }),
                  overallRiskRating: event.row.overallRiskRating,
                  riskStatus: event.row.riskStatus,
                  approvedBy: this.auth.getUserName(),
                  verifiedBy: this.auth.getUserName(),
                  acceptedBy: this.auth.getUserName(),
                  deferredBy: this.auth.getUserName(),
                  comments: event.comment,
                  verificationComments: event.comment,
                  acceptanceReason: event.comment,
                  deferredReason: event.comment
                };

                // Send emails based on risk status
                this.sendEmailsBasedOnStatus(riskDetails, baseContext, emailConfig, id);
              },
              error: (error) => {
                console.error('Failed to get assignee details:', error);
                this.notification.success('The risk has been approved successfully but email notifications could not be sent');
                this.isLoader = false;
                this.refershTableData();
                this.cdr.markForCheck();
              }
            });
          },
          error: (error) => {
            console.error('Error updating review status:', error);
            this.notification.error('Failed to approve risk');
            this.isLoader = false;
          }
        });
      },
      (error) => {
        console.error('Error getting risk details:', error);
        this.notification.error('Failed to get risk details');
        this.isLoader = false;
      }
    );
  }

  rejectRisk(event: { row: any; comment: string }) {
    this.isLoader = true;
    const updates = {
      approvalStatus: 'Rejected',
      comments: event.comment,
    };
    let id = event.row.id;
    this.api.getRiskById(id).subscribe((res: any) => {
      this.impact = res.impact;
      this.mitigation = res.mitigation;

      let reviewToUpdate: number | null = null;
      let pendingReviewFound = false;

      for (const assessment of res.riskAssessments) {
        if (assessment.review && assessment.review.reviewStatus === "ReviewPending") {
          reviewToUpdate = assessment.review.id;
          pendingReviewFound = true;
          break;
        }
      }

      if (!pendingReviewFound) {
        if (event.row.riskStatus === 'closed') {
          let latestReview = null;
          let latestReviewId = 0;

          for (const assessment of res.riskAssessments) {
            if (assessment.review && assessment.review.id > latestReviewId) {
              latestReview = assessment.review;
              latestReviewId = assessment.review.id;
            }
          }

          reviewToUpdate = latestReview ? latestReview.id : null;
          if (!reviewToUpdate) {
            this.notification.error('No valid review found for this closed risk');
            this.isLoader = false;
            return;
          }
        } else {
          if (res.riskAssessments.length > 0) {
            for (let i = 0; i < res.riskAssessments.length; i++) {
              if (res.riskAssessments[i].review) {
                reviewToUpdate = res.riskAssessments[i].review.id;
                break;
              }
            }
          } else {
            this.notification.error('No assessments found for this risk');
            this.isLoader = false;
            return;
          }
        }
      }

      this.api.updateReviewStatusAndComments(id, { ...updates, reviewId: reviewToUpdate }).subscribe({
        next: () => {
          if (
            event.row.riskStatus === 'open' ||
            event.row.riskStatus === 'closed'
          ) {
            this.api.getriskOwnerEmailandName(id).subscribe({
              next: (res: any) => {
                this.assignee = res;
                const context = {
                  reviewer: this.auth.getUserName(),
                  responsibleUser: res[0].name,
                  riskId: event.row.riskId,
                  riskName: event.row.riskName,
                  description: event.row.description,
                  riskType: event.row.riskType,
                  impact: this.impact,
                  mitigation: this.mitigation,
                  plannedActionDate: new Date(
                    event.row.plannedActionDate
                  ).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }),
                  overallRiskRating: event.row.overallRiskRating,
                  riskStatus: event.row.riskStatus,
                  reason: event.comment,
                };

                this.email.sendOwnerEmail(res[0].email, context).subscribe({
                  next: () => {
                    if (event.row.riskStatus === 'closed') {
                      this.api.getAssigneeByRiskId(id).subscribe({
                        next: (assigneeRes: any) => {
                          const assigneeContext = {
                            reviewer: this.auth.getUserName(),
                            responsibleUser: assigneeRes.fullName,
                            riskId: event.row.riskId,
                            riskName: event.row.riskName,
                            description: event.row.description,
                            riskType: event.row.riskType,
                            impact: event.row.impact,
                            mitigation: event.row.mitigation,
                            plannedActionDate: new Date(
                              event.row.plannedActionDate
                            ).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }),
                            overallRiskRating: event.row.overallRiskRating,
                            riskStatus: event.row.riskStatus,
                            reason: event.comment,
                          };

                          this.email
                            .sendOwnerEmail(assigneeRes.email, assigneeContext)
                            .subscribe({
                              next: () => {
                                this.notification.success(
                                  'The risk has been rejected successfully '
                                );
                                this.isLoader = false;
                                this.refershTableData();
                                this.cdr.markForCheck();
                              },
                              error: (emailError) => {
                                console.error(
                                  'Failed to send email to assignee:',
                                  emailError
                                );
                                this.notification.success(
                                  'The risk has been rejected successfully'
                                );
                                this.isLoader = false;
                                this.refershTableData();
                                this.cdr.markForCheck();
                              },
                            });
                        },
                        error: (error) => {
                          console.error('Failed to get assignee details:', error);
                          this.notification.success(
                            'The risk has been rejected successfully'
                          );
                          this.isLoader = false;
                          this.refershTableData();
                          this.cdr.markForCheck();
                        },
                      });
                    } else {
                      this.notification.success(
                        'The risk has been rejected successfully'
                      );
                      this.isLoader = false;
                      this.refershTableData();
                      this.cdr.markForCheck();
                    }
                  },
                  error: (emailError) => {
                    console.error(
                      'Failed to send email to risk owner:',
                      emailError
                    );
                    this.notification.success(
                      'The risk has been rejected successfully'
                    );
                    this.isLoader = false;
                    this.refershTableData();
                    this.cdr.markForCheck();
                  },
                });
              },
              error: (error) => {
                console.error('Failed to get risk owner details:', error);
                this.notification.success(
                  'The risk has been rejected successfully'
                );
                this.isLoader = false;
                this.refershTableData();
                this.cdr.markForCheck();
              },
            });
          }
        },
        error: (error) => {
          console.error('Error updating review status:', error);
          this.notification.error('Failed to reject risk');
          this.isLoader = false;
        },
      });
    },
      (error) => {
        console.error('Error getting risk details:', error);
        this.notification.error('Failed to get risk details');
        this.isLoader = false;
      }
    );
  }
}

import { Component } from '@angular/core';
import { BodyContainerComponent } from '../../Components/body-container/body-container.component';
import { RiskBasicDetailsCardComponent } from '../../Components/risk-basic-details-card/risk-basic-details-card.component';
import { RiskDetailsSection2Component } from '../../Components/risk-details-section2/risk-details-section2.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { StyleButtonComponent } from '../../UI/style-button/style-button.component';
import { ConfirmationPopupComponent } from '../../Components/confirmation-popup/confirmation-popup.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { EmailService } from '../../Services/email.service';
import { AuthService } from '../../Services/auth/auth.service';
import { NotificationService } from '../../Services/notification.service';
import { FormLoaderComponent } from "../../Components/form-loader/form-loader.component";

@Component({
  selector: 'app-approval',
  standalone: true,
  imports: [
    BodyContainerComponent,
    RiskBasicDetailsCardComponent,
    RiskDetailsSection2Component,
    FormsModule,
    ReactiveFormsModule,
    StyleButtonComponent,
    ConfirmationPopupComponent, NgIf,
    FormLoaderComponent
],
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.scss',
})
export class ApprovalComponent {
  data:any=[];
  isAdmin:boolean=false;
  showButtons:boolean=true;
  isLoader = false;
  constructor(
    public api: ApiService,
    public route:ActivatedRoute,
    private email:EmailService,
    private auth:AuthService,
    private notification:NotificationService,
    private router:Router
  ) {}
  isLoading=true
  basdicDetailsData:any={}
  riskDetailsSection2Data:any={}
  riskDetailsSection3MitigationData:any={}

  ngOnInit(){
    const role = this.auth.getUserRole(); // Fetch user role
    this.isAdmin = role === 'Admin';
    let id = parseInt(this.route.snapshot.paramMap.get('id')!);
    this.api.getRiskById(id).subscribe(e=>{
      this.data=e

      console.log("data in approval table",this.data)
      this.basdicDetailsData={
        riskNumber:this.data.riskNumber,
        riskType:this.data.riskType,
        riskDesc:this.data.riskDesc,
        riskName:this.data.riskName,
        overallRiskRating:this.data.overallRiskRating,
        riskStatus:this.data.riskStatus,
        isEditable:false,
        allData:this.data
      }

      this.riskDetailsSection2Data={
        riskMitigation:this.data.mitigation,
        riskContengency:this.data.contingency,
        responsibilityOfAction:this.data.responsibleUser.fullName,
        plannedActionDate:this.data.plannedActionDate,
        impact:this.data.impact,
        CreatedBy:this.data.createdBy.fullName,
        CreatedAt:this.data.createdAt,
        UpdatedBy:this.data.updatedBy.fullName,
        UpdatedAt:this.data.updatedAt,
        ReviewedBy:this.data.reviewedBy,
        ReviewedAt:this.data.reviewedAt,
        PostReviewedBy:this.data.postReviewedBy,
        PostReviewedAt:this.data.postReviewedAt,
        RiskStatus:this.data.riskStatus,
        ClosedDate:this.data.closedDate,
        RiskResponse:this.data.riskResponse,
        Remarks:this.data.remarks
      }

      this.riskDetailsSection3MitigationData={
        riskId:this.data.riskId,
        riskAssesments:this.data.riskAssessments,
        status:this.data.status,
        type:this.data.type,
        residualRisk:this.data.residualRisk,
        residualValue:this.data.residualValue,
        percentageReduction:this.data.percentageRedution,
      }
      this.isLoading=false
    });
  }

  isPopupOpen = false;
  popupTitle = '';
  popupConfirmText = '';
  showPopupComment = true;
  isPopupReject = false;

  isDataAvailable(): boolean {
    return this.data && Object.keys(this.data).length > 0;
  }

  openPopup(isReject: boolean) {
    this.isPopupOpen = true;
    this.isPopupReject = isReject;

    if (isReject) {
      this.popupTitle = 'Reject Risk';
      this.popupConfirmText = 'Reject';
    } else {
      this.popupTitle = 'Approve Risk';
      this.popupConfirmText = 'Approve';
    }
  }

  // New method to determine email recipients and methods based on risk status
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
        config.recipients = ['owner',res.responsibleUser.email];
        config.emailMethods = ['sendRiskAcceptanceEmail','sendRiskAcceptanceEmail'];
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

  // New method to send emails based on status
  private sendEmailsBasedOnStatus(res: any, baseContext: any, emailConfig: any, riskId: number) {
    let emailsSent = 0;
    const totalEmails = emailConfig.recipients.length;

    const checkEmailsComplete = () => {
      emailsSent++;
      if (emailsSent >= totalEmails) {
        this.isLoader = false;
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

  // New method to route to appropriate email sending method
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

  handlePopupConfirm(event: { comment: string }) {
    this.isLoader = true;
    this.isPopupOpen = false;
    let id = parseInt(this.route.snapshot.paramMap.get('id')!);

    this.api.getRiskById(id).subscribe((res: any) => {

        let reviewToUpdate: number | null = null;
        let pendingReviewFound = false;

        // First check if there's a review with "Pending" status, prioritize it
        for (const assessment of res.riskAssessments) {
          if (assessment.review && assessment.review.reviewStatus === "ReviewPending") {
            reviewToUpdate = assessment.review.id;
            pendingReviewFound = true;
            break;
          }
        }

        if (!pendingReviewFound) {
          if (res.riskStatus === 'Closed') {
            // For closed risks, find the latest review in the assessments
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

      if (this.isPopupReject) {
        const updates = {
          approvalStatus: "Rejected",
          comments: event.comment,
          reviewId: reviewToUpdate
        };

        this.api.updateReviewStatusAndComments(id, updates).subscribe({
          next: () => {
            this.notification.success("The risk has been Rejected");
            this.showButtons = false;

            if (res.riskStatus === 'open' || res.riskStatus === 'closed') {
              const context = {
                reviewer: this.auth.getUserName(),
                responsibleUser: res.createdBy.fullName,
                riskId: res.riskId,
                riskName: res.riskName,
                description: res.description,
                riskType: res.riskType,
                impact: res.impact,
                mitigation: res.mitigation,
                plannedActionDate: new Date(res.plannedActionDate)
                  .toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }),
                overallRiskRating: res.overallRiskRating,
                riskStatus: res.riskStatus,
                reason: event.comment
              };

              this.email.sendOwnerEmail(res.createdBy.email, context).subscribe({
                next: () => {
                  // Email sent successfully to owner
                  this.isLoader = false;
                },
                error: (emailError) => {
                  console.error('Failed to send email to risk owner:', emailError);
                  this.isLoader = false;
                }
              });
            }

            if (res.riskStatus === 'closed') {
              const context = {
                reviewer: this.auth.getUserName(),
                responsibleUser: res.responsibleUser.fullName,
                riskId: res.riskId,
                riskName: res.riskName,
                description: res.description,
                riskType: res.riskType,
                impact: res.impact,
                mitigation: res.mitigation,
                plannedActionDate: new Date(res.plannedActionDate).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                ),
                overallRiskRating: res.overallRiskRating,
                reason: event.comment,
              };

              this.email.sendOwnerEmail(res.responsibleUser.email, context).subscribe({
                next: () => {
                  // Email sent successfully to reviewer
                  this.isLoader = false;
                },
                error: (emailError) => {
                  console.error('Failed to send email to reviewer:', emailError);
                  this.isLoader = false;
                },
              });
            }

            this.isLoader = false;
            this.router.navigate(['/approvals']);
          },
          error: (error) => {
            console.error('Error updating review status:', error);
            this.notification.error('Failed to reject risk');
            this.isLoader = false;
          }
        });
      } else {
        // APPROVAL LOGIC - Updated to handle all risk statuses
        this.isLoader = true;
        const updates = {
          approvalStatus: "Approved",
          comments: event.comment,
          reviewId: reviewToUpdate
        };

        this.api.updateReviewStatusAndComments(id, updates).subscribe({
          next: () => {
            this.notification.success("The risk has been Approved successfully");
            this.showButtons = false;

            // Get email configuration based on risk status
            const emailConfig = this.getEmailRecipientsAndTemplate(res.riskStatus, res);

            // Prepare base context
            const baseContext = {
              responsibleUser: res.responsibleUser.fullName,
              riskId: res.riskId,
              riskName: res.riskName,
              description: res.description,
              riskType: res.riskType,
              impact: res.impact,
              mitigation: res.mitigation,
              plannedActionDate: new Date(res.plannedActionDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
              overallRiskRating: res.overallRiskRating,
              riskStatus: res.riskStatus,
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
            this.sendEmailsBasedOnStatus(res, baseContext, emailConfig, id);

            this.router.navigate(['/approvals']);
          },
          error: (error) => {
            console.error('Error updating review status:', error);
            this.notification.error('Failed to approve risk');
            this.isLoader = false;
          }
        });
      }
    },
    (error) => {
      console.error('Error getting risk details:', error);
      this.notification.error('Failed to get risk details');
      this.isLoader = false;
    });
  }

  handlePopupCancel() {
    this.isPopupOpen = false;
  }
}

import { Component } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmailService } from '../../Services/email.service';
import { NgIf } from '@angular/common';
import { NotificationService } from '../../Services/notification.service';

@Component({
  selector: 'app-thankyou',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './approved-response.component.html',
  styleUrl: './approved-response.component.scss',
})
export class ThankyouComponent {
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private email: EmailService,
    private notification: NotificationService
  ) {
    this.ApprovalForm = this.fb.group({
      reason: ['', Validators.required],
    });
  }
  riskId: number = 0;
  approvalStatus: string | null = null;
  ApprovalComments: string = '';
  riskData: any;
  context: any;

  ApprovalForm: FormGroup;
  isReasonSubmitted: boolean = false;

  get reasonControl() {
    return this.ApprovalForm.get('reason');
  }
  isSubmitting = false;

  // NEW METHOD: Get email recipients and template based on risk status
  private getEmailRecipientsAndTemplate(riskStatus: string, riskDetails: any) {
    const config = {
      recipients: [] as string[],
      emailMethods: [] as string[],
    };

    switch (riskStatus.toLowerCase()) {
      case 'open':
        config.recipients = [riskDetails.responsibleUser.email, 'owner'];
        config.emailMethods = ['sendAssigneeEmail', 'sendApprovalEmail'];
        break;

      case 'undertreatment':
      case 'monitoring':
        config.recipients = [riskDetails.responsibleUser.email, 'owner'];
        config.emailMethods = ['sendStatusUpdateEmail', 'sendStatusUpdateEmail'];
        break;

      case 'accepted':
        config.recipients = ['owner', riskDetails.responsibleUser.email];
        config.emailMethods = ['sendRiskAcceptanceEmail', 'sendRiskAcceptanceEmail'];
        break;

      case 'deferred':
        config.recipients = [riskDetails.responsibleUser.email, 'owner'];
        config.emailMethods = ['sendRiskDeferredEmail', 'sendRiskDeferredEmail'];
        break;

      case 'close':
      case 'closed':
        config.recipients = [riskDetails.responsibleUser.email, 'owner'];
        config.emailMethods = ['sendRiskClosureEmail', 'sendRiskClosureEmail'];
        break;

      default:
        config.recipients = ['owner'];
        config.emailMethods = ['sendGeneralStatusEmail'];
    }

    return config;
  }

  // NEW METHOD: Send emails based on status
  private sendEmailsBasedOnStatus(riskDetails: any, baseContext: any, emailConfig: any) {
    let emailsSent = 0;
    const totalEmails = emailConfig.recipients.length;

    const checkEmailsComplete = () => {
      emailsSent++;
      if (emailsSent >= totalEmails) {
        this.isSubmitting = false;
        this.isReasonSubmitted = true;
      }
    };

    emailConfig.recipients.forEach((recipient: string, index: number) => {
      if (recipient === 'owner') {
        // Get owner email
        this.api.getriskOwnerEmailandName(this.riskId).subscribe({
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

  submitReason(): void {
    if (this.ApprovalForm.invalid) {
      this.ApprovalForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;

    this.ApprovalComments = this.ApprovalForm.value.reason;
    const idParam = this.route.snapshot.paramMap.get('id');
    this.riskId = idParam ? +idParam : 0;
    this.approvalStatus = 'Approved';

    this.api.getRiskById(this.riskId).subscribe({
      next: (riskDetails: any) => {
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
          if (riskDetails.riskStatus === 'closed') {
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
              this.isSubmitting = false;
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
              this.isSubmitting = false;
              return;
            }
          }
        }

        const approvalUpdates = {
          approvalStatus: 'Approved',
          comments: this.ApprovalComments,
          reviewId: reviewToUpdate
        };

        this.api.updateReviewStatusAndComments(this.riskId, approvalUpdates).subscribe({
          next: () => {
            this.notification.success("The risk has been Approved successfully");

            const impact = riskDetails.impact;
            const mitigation = riskDetails.mitigation;

            let reviewerName = 'External Reviewer';
            if (riskDetails.riskStatus === 'open' && riskDetails.riskAssessments.length > 1) {
              reviewerName = riskDetails.riskAssessments[0].review?.reviewerName || reviewerName;
            } else if (riskDetails.riskAssessments && riskDetails.riskAssessments.length > 0) {
              const latestAssessment = riskDetails.riskAssessments[riskDetails.riskAssessments.length - 1];
              reviewerName = latestAssessment.review?.reviewerName || reviewerName;
            }

            // Get email configuration based on risk status
            const emailConfig = this.getEmailRecipientsAndTemplate(riskDetails.riskStatus, riskDetails);

            // Prepare base context
            const baseContext = {
              responsibleUser: riskDetails.responsibleUser.fullName,
              riskId: riskDetails.riskId,
              riskName: riskDetails.riskName,
              description: riskDetails.description,
              riskType: riskDetails.riskType,
              impact: impact,
              mitigation: mitigation,
              plannedActionDate: new Date(riskDetails.plannedActionDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
              overallRiskRating: riskDetails.overallRiskRating,
              riskStatus: riskDetails.riskStatus,
              approvedBy: reviewerName,
              verifiedBy: reviewerName,
              acceptedBy: reviewerName,
              deferredBy: reviewerName,
              comments: this.ApprovalComments,
              verificationComments: this.ApprovalComments,
              acceptanceReason: this.ApprovalComments,
              deferredReason: this.ApprovalComments
            };

            // Send emails based on risk status
            this.sendEmailsBasedOnStatus(riskDetails, baseContext, emailConfig);
          },
          error: (error) => {
            console.error('Error updating review status:', error);
            this.notification.error('Failed to approve risk');
            this.isSubmitting = false;
          }
        });
      },
      error: (error) => {
        console.error('Error getting risk details:', error);
        this.notification.error('Failed to get risk details');
        this.isSubmitting = false;
      }
    });
  }
}

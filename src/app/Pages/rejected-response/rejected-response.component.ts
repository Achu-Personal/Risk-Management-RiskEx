import { Component } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { EmailService } from '../../Services/email.service';
import { NotificationService } from '../../Services/notification.service';

@Component({
  selector: 'app-rejected-response',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './rejected-response.component.html',
  styleUrl: './rejected-response.component.scss',
})
export class RejectedResponseComponent {
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private email: EmailService,
    private notification: NotificationService
  ) {
    this.rejectionForm = this.fb.group({
      reason: ['', Validators.required],
    });
  }
  riskId: number = 0;
  approvalStatus: string | null = null;
  rejectionReason: string = '';
  riskData: any;
  context: any;

  rejectionForm: FormGroup;
  isReasonSubmitted: boolean = false;

  get reasonControl() {
    return this.rejectionForm.get('reason');
  }
  isSubmitting = false;

  // NEW METHOD: Get email recipients for rejection based on risk status
  private getRejectionEmailRecipients(riskStatus: string, riskDetails: any) {
    const config = {
      recipients: [] as string[],
      emailMethods: [] as string[]
    };

    switch (riskStatus.toLowerCase()) {
      case 'open':
        // For open risks, send to creator (owner) and optionally to assignee
        config.recipients = [riskDetails.createdBy.email, 'owner'];
        config.emailMethods = ['sendOwnerEmail', 'sendOwnerEmail'];
        break;

      case 'close':
      case 'closed':
        // For closure rejections, send to responsible user and owner
        config.recipients = [riskDetails.responsibleUser.email, 'owner'];
        config.emailMethods = ['sendOwnerEmail', 'sendOwnerEmail'];
        break;

      case 'undertreatment':
      case 'monitoring':
      case 'accepted':
      case 'deferred':
        // For other status changes, send to responsible user and owner
        config.recipients = [riskDetails.responsibleUser.email, 'owner'];
        config.emailMethods = ['sendOwnerEmail', 'sendOwnerEmail'];
        break;

      default:
        // Default: send only to owner
        config.recipients = ['owner'];
        config.emailMethods = ['sendOwnerEmail'];
    }

    return config;
  }

  // NEW METHOD: Send rejection emails based on status
  private sendRejectionEmailsBasedOnStatus(riskDetails: any, baseContext: any, emailConfig: any) {
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
            // Create owner-specific context
            const ownerContext = {
              ...baseContext,
              responsibleUser: ownerRes[0].name
            };
            this.email.sendOwnerEmail(ownerRes[0].email, ownerContext).subscribe({
              next: () => {
                console.log('Rejection email sent to owner successfully');
                checkEmailsComplete();
              },
              error: (error) => {
                console.error('Failed to send rejection email to owner:', error);
                checkEmailsComplete();
              }
            });
          },
          error: (error) => {
            console.error('Failed to get risk owner details:', error);
            checkEmailsComplete();
          }
        });
      } else {
        // Direct email address
        this.email.sendOwnerEmail(recipient, baseContext).subscribe({
          next: () => {
            console.log('Rejection email sent successfully to:', recipient);
            checkEmailsComplete();
          },
          error: (error) => {
            console.error('Failed to send rejection email:', error);
            checkEmailsComplete();
          }
        });
      }
    });
  }

  submitReason(): void {
    if (this.rejectionForm.invalid) {
      this.rejectionForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;

    this.rejectionReason = this.rejectionForm.value.reason;
    const idParam = this.route.snapshot.paramMap.get('id');
    this.riskId = idParam ? +idParam : 0;
    this.approvalStatus = 'Rejected';

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

        const rejectionUpdates = {
          approvalStatus: 'Rejected',
          comments: this.rejectionReason,
          reviewId: reviewToUpdate
        };

        this.api.updateReviewStatusAndComments(this.riskId, rejectionUpdates).subscribe({
          next: () => {
            this.notification.success("The risk has been Rejected successfully");

            let reviewerName = 'External Reviewer';
            if (riskDetails.riskStatus === 'open' && riskDetails.riskAssessments.length > 1) {
              reviewerName = riskDetails.riskAssessments[0].review?.reviewerName || reviewerName;
            } else if (riskDetails.riskAssessments && riskDetails.riskAssessments.length > 0) {
              const latestAssessment = riskDetails.riskAssessments[riskDetails.riskAssessments.length - 1];
              reviewerName = latestAssessment.review?.reviewerName || reviewerName;
            }

            // Determine responsible user based on status
            const responsibleUserName = riskDetails.riskStatus === 'open'
              ? riskDetails.createdBy.fullName
              : riskDetails.responsibleUser.fullName;

            // Get email configuration based on risk status
            const emailConfig = this.getRejectionEmailRecipients(riskDetails.riskStatus, riskDetails);

            // Prepare base context
            const baseContext = {
              reviewer: reviewerName,
              responsibleUser: responsibleUserName,
              riskId: riskDetails.riskId,
              riskName: riskDetails.riskName,
              description: riskDetails.description,
              riskType: riskDetails.riskType,
              impact: riskDetails.impact,
              mitigation: riskDetails.mitigation,
              plannedActionDate: new Date(riskDetails.plannedActionDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
              overallRiskRating: riskDetails.overallRiskRating,
              riskStatus: riskDetails.riskStatus,
              reason: this.rejectionReason,
            };

            // Send rejection emails based on risk status
            this.sendRejectionEmailsBasedOnStatus(riskDetails, baseContext, emailConfig);
          },
          error: (error) => {
            console.error('Error updating review status:', error);
            this.notification.error('Failed to reject risk');
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

  ngOnInit() {
    // Any initialization logic if needed
  }
}

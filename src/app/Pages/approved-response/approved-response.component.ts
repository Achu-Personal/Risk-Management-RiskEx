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
          if (riskDetails.riskStatus === 'close') {
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
            this.isReasonSubmitted = true;
            const impact = riskDetails.impact;
            const mitigation = riskDetails.mitigation;

            let reviewerName = 'External Reviewer';
            if (riskDetails.riskStatus === 'open' && riskDetails.riskAssessments.length > 1) {
              reviewerName = riskDetails.riskAssessments[0].review?.reviewerName || reviewerName;
            } else if (riskDetails.riskAssessments && riskDetails.riskAssessments.length > 0) {
              const latestAssessment = riskDetails.riskAssessments[riskDetails.riskAssessments.length - 1];
              reviewerName = latestAssessment.review?.reviewerName || reviewerName;
            }

            if (riskDetails.riskStatus === 'open') {
              const context = {
                responsibleUser: riskDetails.responsibleUser.fullName,
                riskId: riskDetails.riskId,
                riskName: riskDetails.riskName,
                description: riskDetails.description,
                riskType: riskDetails.riskType,
                impact: impact,
                mitigation: mitigation,
                plannedActionDate: new Date(riskDetails.plannedActionDate).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                ),
                overallRiskRating: riskDetails.overallRiskRating,
                riskStatus: riskDetails.riskStatus,
                approvedBy: reviewerName,
                comments: this.ApprovalComments,
              };

              this.email.sendAssigneeEmail(riskDetails.responsibleUser.email, context).subscribe({
                next: () => {
                  // console.log('Assignee email sent successfully');

                  this.api.getriskOwnerEmailandName(this.riskId).subscribe({
                    next: (ownerRes: any) => {
                      this.email.sendApprovalEmail(ownerRes[0].email, context).subscribe({
                        next: () => {
                          console.log('Risk Owner approval email sent successfully');
                          this.notification.success('The risk has been approved successfully and emails sent to assignee and risk owner');
                        },
                        error: (emailError) => {
                          console.error('Failed to send approval email to risk owner:', emailError);
                          this.notification.success('The risk has been approved successfully and email sent to assignee');
                        }
                      });
                    },
                    error: (error) => {
                      console.error('Failed to get risk owner details:', error);
                      this.notification.success('The risk has been approved successfully and email sent to assignee');
                    }
                  });
                },
                error: (emailError) => {
                  console.error('Failed to send email to assignee:', emailError);
                  this.notification.success('The risk has been approved successfully');
                }
              });
            } else if (riskDetails.riskStatus === 'close') {
              const closureContext = {
                responsibleUser: riskDetails.responsibleUser.fullName,
                riskId: riskDetails.riskId,
                riskName: riskDetails.riskName,
                description: riskDetails.description,
                riskType: riskDetails.riskType,
                impact: impact,
                mitigation: mitigation,
                plannedActionDate: new Date(riskDetails.plannedActionDate).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                ),
                overallRiskRating: riskDetails.overallRiskRating,
                riskStatus: riskDetails.riskStatus,
                verifiedBy: reviewerName,
                verificationComments: this.ApprovalComments
              };

              const closureContextOwner = {
                riskId: riskDetails.riskId,
                riskName: riskDetails.riskName,
                description: riskDetails.description,
                riskType: riskDetails.riskType,
                impact: impact,
                mitigation: mitigation,
                plannedActionDate: new Date(riskDetails.plannedActionDate).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                ),
                overallRiskRating: riskDetails.overallRiskRating,
                verifiedBy: reviewerName,
                verificationComments: this.ApprovalComments
              };

              this.api.getriskOwnerEmailandName(this.riskId).subscribe({
                next: (ownerRes: any) => {
                  this.email.sendRiskClosureEmail(ownerRes[0].email, closureContextOwner).subscribe({
                    next: () => {
                      console.log('Risk closure email sent to owner successfully');

                      this.email.sendRiskClosureEmail(riskDetails.responsibleUser.email, closureContext).subscribe({
                        next: () => {
                          console.log('Risk closure email sent to assignee successfully');
                          this.notification.success(
                            'The risk has been approved and closed successfully. Closure notifications sent to owner and assignee.'
                          );
                        },
                        error: (emailError) => {
                          console.error('Failed to send closure email to assignee:', emailError);
                          this.notification.success(
                            'The risk has been approved and closed successfully. Closure notification sent to owner only.'
                          );
                        }
                      });
                    },
                    error: (emailError) => {
                      console.error('Failed to send closure email to owner:', emailError);
                      this.notification.success(
                        'The risk has been approved and closed successfully, but email notifications failed.'
                      );
                    }
                  });
                },
                error: (error) => {
                  console.error('Failed to get risk owner details:', error);
                  this.notification.success(
                    'The risk has been approved and closed successfully but email notifications could not be sent'
                  );
                }
              });
            }
          },
          error: (error) => {
            console.error('Error updating review status:', error);
            this.notification.error('Failed to approve risk');
          },
          complete: () => {
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

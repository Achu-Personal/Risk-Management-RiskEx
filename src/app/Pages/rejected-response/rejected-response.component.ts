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

        const rejectionUpdates = {
          approvalStatus: 'Rejected',
          comments: this.rejectionReason,
          reviewId: reviewToUpdate
        };

        this.api.updateReviewStatusAndComments(this.riskId, rejectionUpdates).subscribe({
          next: () => {
            this.isReasonSubmitted = true;

            let reviewerName = 'External Reviewer';
            if (riskDetails.riskStatus === 'open' && riskDetails.riskAssessments.length > 1) {
              reviewerName = riskDetails.riskAssessments[0].review?.reviewerName || reviewerName;
            } else if (riskDetails.riskAssessments && riskDetails.riskAssessments.length > 0) {
              const latestAssessment = riskDetails.riskAssessments[riskDetails.riskAssessments.length - 1];
              reviewerName = latestAssessment.review?.reviewerName || reviewerName;
            }

            if (riskDetails.riskStatus === 'open') {
              this.context = {
                reviewer: reviewerName,
                responsibleUser: riskDetails.createdBy.fullName,
                riskId: riskDetails.riskId,
                riskName: riskDetails.riskName,
                description: riskDetails.description,
                riskType: riskDetails.riskType,
                impact: riskDetails.impact,
                mitigation: riskDetails.mitigation,
                plannedActionDate: new Date(riskDetails.plannedActionDate).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                ),
                overallRiskRating: riskDetails.overallRiskRating,
                reason: this.rejectionReason,
              };

              this.email.sendOwnerEmail(riskDetails.createdBy.email, this.context).subscribe({
                next: () => {
                  console.log('Email sent successfully to creator:', riskDetails.createdBy.email);
                  this.notification.success('Risk has been rejected and notification sent to risk creator');
                },
                error: (emailError) => {
                  console.error('Failed to send email to creator:', emailError);
                  this.notification.success('Risk has been rejected but notification could not be sent');
                },
              });
            }

            if (riskDetails.riskStatus === 'close') {
              this.context = {
                reviewer: reviewerName,
                responsibleUser: riskDetails.responsibleUser.fullName,
                riskId: riskDetails.riskId,
                riskName: riskDetails.riskName,
                description: riskDetails.description,
                riskType: riskDetails.riskType,
                impact: riskDetails.impact,
                mitigation: riskDetails.mitigation,
                plannedActionDate: new Date(riskDetails.plannedActionDate).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                ),
                overallRiskRating: riskDetails.overallRiskRating,
                reason: this.rejectionReason,
              };

              this.email.sendOwnerEmail(riskDetails.responsibleUser.email, this.context).subscribe({
                next: () => {
                  console.log('Email sent successfully to responsible user:', riskDetails.responsibleUser.email);
                  this.notification.success('Risk closure has been rejected and notification sent to responsible user');
                },
                error: (emailError) => {
                  console.error('Failed to send email to responsible user:', emailError);
                  this.notification.success('Risk closure has been rejected but notification could not be sent');
                },
              });
            }
          },
          error: (error) => {
            console.error('Error updating review status:', error);
            this.notification.error('Failed to reject risk');
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

  ngOnInit() {
    // Any initialization logic if needed
  }
}

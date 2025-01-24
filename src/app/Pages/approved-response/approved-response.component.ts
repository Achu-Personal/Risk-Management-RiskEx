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

  // Getter for form control
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
    const approvalUpdates = {
      approvalStatus: 'Approved',
      comments: this.ApprovalComments,
    };
    this.api
      .updateReviewStatusAndComments(this.riskId, approvalUpdates)
      .subscribe({
        next: () => {
          this.isReasonSubmitted = true;

          this.api.getRiskById(this.riskId).subscribe((res: any) => {
            console.log('risk status:', res.riskStatus);

            if (res.riskStatus === 'open') {
              // this.assignee=res;
              // console.log(this.assignee);
              const context = {
                responsibleUser: res.responsibleUser.fullName,
                riskId: this.riskId,
                riskName: res.riskName,
                description: res.description,
                riskType: res.riskType,
                plannedActionDate: res.plannedActionDate,
                overallRiskRating: res.overallRiskRating,
                riskStatus: res.riskStatus,
              };

              console.log('context:', context);
              this.email
                .sendAssigneeEmail(res.responsibleUser.email, context)
                .subscribe({
                  next: () => {
                    console.log('Assignee email sent successfully');
                  },
                  error: (emailError) => {
                    console.error(
                      'Failed to send email to assignee:',
                      emailError
                    );
                  },
                });
            }
            if (res.riskStatus === 'close') {
              this.notification.success('The risk has closed successfully');
            }
          });
        },
        error: (error) => {
          console.error('Error updating review status:', error);
          this.notification.error('Failed to approve risk');
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    console.log('Risk ID:', this.riskId);
    console.log('Approval Status', this.approvalStatus);

    console.log('approval Comment:', this.ApprovalComments);
  }
}


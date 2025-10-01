import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';
import { environment } from '../../enviroments/environment';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  emailTemplate: string = '';
  reviewerEmailTemplate: string = '';
  postreviewerEmailTemplate: string = '';
  approvalEmailTemplate: string = '';
  assigneeEmailTemplate: string = '';
  ownerEmailTemplate: string = '';
  userRegisterTemplate: string = '';
  resetPasswordTemplate: string = '';
  userUpdateTemplate: string = '';
  riskClosureTemplate: string = '';

  // New template properties
  statusUpdateTemplate: string = '';
  riskAcceptanceTemplate: string = '';
  riskDeferredTemplate: string = '';
  generalStatusTemplate: string = '';

  statusChangeReviewTemplate: string = '';


  private readonly baseUrl = environment.apiUrl;

  private readonly frontendUrl = environment.frontendUrl;

  createdByUserName: any;

  constructor(
    private api: ApiService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.loadReviewTemplate();
    this.loadAssigneeTemplate();
    this.loadOwnerTemplate();
    this.loadPostTemplate();
    this.loadUserRegisterTemplate();
    this.loadResetPasswordTemplate();
    this.loadUserUpdateTemplate();
    this.loadApprovalTemplate();
    this.loadRiskClosureTemplate();

    this.loadStatusUpdateTemplate();
    this.loadRiskAcceptanceTemplate();
    this.loadRiskDeferredTemplate();
    this.loadGeneralStatusTemplate();

    this.loadStatusChangeReviewTemplate();

  }

  getCreatedByUserName(riskId: string): Promise<any> {
    return new Promise((resolve) => {
      this.api.getCreatedByUserName(riskId).subscribe({
        next: (response) => {
          // console.log('Created user:', response);
          this.createdByUserName = response;
          resolve(response);
        },
        error: (error) => {
          console.error('Error fetching user name:', error);
          this.createdByUserName = 'Unknown User';
          resolve('Unknown User');
        },
      });
    });
  }

  // 3. Add the load template method
private async loadStatusChangeReviewTemplate() {
  try {
    this.statusChangeReviewTemplate = await fetch(
      'Templates/StatusChangeReviewTemplate.html'
    ).then((response) => response.text());
  } catch (error) {
    console.error('Failed to load status change review template:', error);
  }
}

// 4. Add helper method to get status class for styling
private getStatusClass(status: string): string {
  // Add null/undefined check and convert to string
  if (!status) {
    return 'open'; // default fallback
  }

  const statusLower = String(status).toLowerCase(); // Force conversion to string

  switch (statusLower) {
    case 'open':
      return 'open';
    case 'undertreatment':
    case 'under treatment':
      return 'undertreatment';
    case 'monitoring':
      return 'monitoring';
    case 'accepted':
      return 'accepted';
    case 'deferred':
      return 'deferred';
    case 'close':
    case 'closed':
      return 'closed';
    default:
      return 'open';
  }
}

// 5. Add method to prepare the email
async prepareStatusChangeReviewEmail(context: any): Promise<string> {
  await this.getCreatedByUserName(context.riskId);
  return this.addRiskDetailsForStatusChangeReview(
    this.statusChangeReviewTemplate,
    context
  );
}

// 6. Add method to populate template with risk details
private addRiskDetailsForStatusChangeReview(
  template: string,
  context: any
): string {
  const newStatus = context.newStatus ? String(context.newStatus) : 'Open';
  const oldStatus = context.oldStatus ? String(context.oldStatus) : 'Open';
  const statusClass = this.getStatusClass(newStatus);

  return template
    .replace(/{{createdBy}}/g, this.createdByUserName || 'Unknown')
    .replace(/{{responsibleUser}}/g, context.responsibleUser || 'Unknown')
    .replace(/{{reviewer}}/g, context.reviewer || 'Reviewer')
    .replace(/{{riskId}}/g, context.riskId || '')
    .replace(/{{riskName}}/g, context.riskName || '')
    .replace(/{{description}}/g, context.description || '')
    .replace(/{{riskType}}/g, context.riskType || '')
    .replace(/{{impact}}/g, context.impact || 'Not specified')
    .replace(/{{mitigation}}/g, context.mitigation || '')
    .replace(/{{plannedActionDate}}/g, context.plannedActionDate || 'Not specified')
    .replace(/{{overallRiskRating}}/g, String(context.overallRiskRating || ''))
    .replace(/{{newStatus}}/g, newStatus.toUpperCase())
    .replace(/{{oldStatus}}/g, oldStatus.toUpperCase())
    .replace(/{{statusChangedBy}}/g, context.statusChangedBy || this.authService.getUserName() || 'Unknown')
    .replace(/{{id}}/g, String(context.id || ''))
    .replace(/{{statusClass}}/g, statusClass)
    .replace(/{{baseUrl}}/g, this.frontendUrl);
}

// 7. Add method to send the email
sendStatusChangeReviewEmail(email: string, context: any): Observable<boolean> {
  const subject = `RISK STATUS CHANGE REVIEW REQUIRED - ${context.riskName}`;
  return from(this.prepareStatusChangeReviewEmail(context)).pipe(
    switchMap((body) => {
      return this.api.sendMail(email, subject, body);
    }),
    map((response: any) => {
      this.notificationService.success(
        'Status change review notification sent successfully'
      );
      return true;
    }),
    catchError((error) => {
      console.error('Error sending status change review email:', error);
      this.notificationService.error(
        'Failed to send status change review notification'
      );
      return of(false);
    })
  );
}


   private async loadStatusUpdateTemplate() {
    try {
      this.statusUpdateTemplate = await fetch(
        'Templates/StatusUpdateEmailTemplate.html'
      ).then((response) => response.text());
    } catch (error) {
      console.error('Failed to load status update email template:', error);
    }
  }

  private async loadRiskAcceptanceTemplate() {
    try {
      this.riskAcceptanceTemplate = await fetch(
        'Templates/RiskAcceptanceEmailTemplate.html'
      ).then((response) => response.text());
    } catch (error) {
      console.error('Failed to load risk acceptance email template:', error);
    }
  }

   // RISK ACCEPTANCE EMAIL
  async prepareRiskAcceptanceEmail(context: any): Promise<string> {
    await this.getCreatedByUserName(context.riskId);
    return this.addRiskDetailsForAcceptance(this.riskAcceptanceTemplate, context);
  }

  private addRiskDetailsForAcceptance(template: string, context: any): string {
    return template
      .replace(/{{createdBy}}/g, this.createdByUserName)
      .replace('{{riskId}}', context.riskId)
      .replace('{{responsibleUser}}', context.responsibleUser)
      .replace('{{riskName}}', context.riskName)
      .replace('{{description}}', context.description)
      .replace('{{riskType}}', context.riskType)
      .replace('{{impact}}', context.impact)
      .replace('{{overallRiskRating}}', context.overallRiskRating)
      .replace('{{acceptedBy}}', context.acceptedBy || context.approvedBy)
      .replace('{{acceptanceReason}}', context.acceptanceReason || context.comments || 'Risk has been formally accepted.')
      .replace(/{{baseUrl}}/g, this.frontendUrl);
  }

  sendRiskAcceptanceEmail(email: string, context: any): Observable<boolean> {
    const subject = `RISK ACCEPTED - ${context.riskName}`;
    return from(this.prepareRiskAcceptanceEmail(context)).pipe(
      switchMap((body) => {
        return this.api.sendMail(email, subject, body);
      }),
      map((response: any) => {
        this.notificationService.success('Risk acceptance notification sent successfully');
        return true;
      }),
      catchError((error) => {
        console.error('Error sending risk acceptance email:', error);
        this.notificationService.error('Failed to send risk acceptance notification');
        return of(false);
      })
    );
  }

  private async loadRiskDeferredTemplate() {
    try {
      this.riskDeferredTemplate = await fetch(
        'Templates/RiskDeferredEmailTemplate.html'
      ).then((response) => response.text());
    } catch (error) {
      console.error('Failed to load risk deferred email template:', error);
    }
  }

  private async loadGeneralStatusTemplate() {
    try {
      this.generalStatusTemplate = await fetch(
        'Templates/GeneralStatusEmailTemplate.html'
      ).then((response) => response.text());
    } catch (error) {
      console.error('Failed to load general status email template:', error);
    }
  }

  // STATUS UPDATE EMAIL (for UnderTreatment, Monitoring)
  async prepareStatusUpdateEmail(context: any): Promise<string> {
     if (!this.statusUpdateTemplate) {
    await this.loadStatusUpdateTemplate();
  }
    await this.getCreatedByUserName(context.riskId);
    return this.addRiskDetailsForStatusUpdate(this.statusUpdateTemplate, context);
  }

  private addRiskDetailsForStatusUpdate(template: string, context: any): string {
    const statusMessage = context.riskStatus === 'undertreatment'
      ? 'is now under active treatment'
      : 'is being actively monitored';

    return template
      .replace(/{{createdBy}}/g, this.createdByUserName)
      .replace('{{responsibleUser}}', context.responsibleUser)
      .replace('{{riskId}}', context.riskId)
      .replace('{{riskName}}', context.riskName)
      .replace('{{description}}', context.description)
      .replace('{{riskType}}', context.riskType)
      .replace('{{impact}}', context.impact)
      .replace('{{mitigation}}', context.mitigation)
      .replace('{{plannedActionDate}}', context.plannedActionDate)
      .replace('{{overallRiskRating}}', context.overallRiskRating)
      .replace('{{riskStatus}}', context.riskStatus.toUpperCase())
      .replace('{{statusMessage}}', statusMessage)
      .replace('{{approvedBy}}', context.approvedBy)
      .replace('{{comments}}', context.comments || 'No additional comments provided.')
      .replace(/{{baseUrl}}/g, this.frontendUrl);
  }

  sendStatusUpdateEmail(email: string, context: any): Observable<boolean> {
    const subject = `RISK STATUS UPDATE - ${context.riskName}`;
    return from(this.prepareStatusUpdateEmail(context)).pipe(
      switchMap((body) => {
        return this.api.sendMail(email, subject, body);
      }),
      map((response: any) => {
        this.notificationService.success('Status update notification sent successfully');
        return true;
      }),
      catchError((error) => {
        console.error('Error sending status update email:', error);
        this.notificationService.error('Failed to send status update notification');
        return of(false);
      })
    );
  }



  // RISK DEFERRED EMAIL
  async prepareRiskDeferredEmail(context: any): Promise<string> {
    await this.getCreatedByUserName(context.riskId);
    return this.addRiskDetailsForDeferred(this.riskDeferredTemplate, context);
  }

  private addRiskDetailsForDeferred(template: string, context: any): string {
    return template
      .replace(/{{createdBy}}/g, this.createdByUserName)
      .replace('{{responsibleUser}}', context.responsibleUser)
      .replace('{{riskId}}', context.riskId)
      .replace('{{riskName}}', context.riskName)
      .replace('{{description}}', context.description)
      .replace('{{riskType}}', context.riskType)
      .replace('{{impact}}', context.impact)
      .replace('{{mitigation}}', context.mitigation)
      .replace('{{overallRiskRating}}', context.overallRiskRating)
      .replace('{{deferredBy}}', context.deferredBy || context.approvedBy)
      .replace('{{deferredReason}}', context.deferredReason || context.comments || 'Risk treatment has been deferred.')
      .replace(/{{baseUrl}}/g, this.frontendUrl);
  }

  sendRiskDeferredEmail(email: string, context: any): Observable<boolean> {
    const subject = `RISK DEFERRED - ${context.riskName}`;
    return from(this.prepareRiskDeferredEmail(context)).pipe(
      switchMap((body) => {
        return this.api.sendMail(email, subject, body);
      }),
      map((response: any) => {
        this.notificationService.success('Risk deferral notification sent successfully');
        return true;
      }),
      catchError((error) => {
        console.error('Error sending risk deferral email:', error);
        this.notificationService.error('Failed to send risk deferral notification');
        return of(false);
      })
    );
  }

  // GENERAL STATUS EMAIL (fallback)
  sendGeneralStatusEmail(email: string, context: any): Observable<boolean> {
    const subject = `RISK STATUS CHANGE - ${context.riskName}`;
    const body = this.addRiskDetailsForGeneral(this.generalStatusTemplate, context);

    return this.api.sendMail(email, subject, body).pipe(
      map((response: any) => {
        this.notificationService.success('Status change notification sent successfully');
        return true;
      }),
      catchError((error) => {
        console.error('Error sending general status email:', error);
        this.notificationService.error('Failed to send status change notification');
        return of(false);
      })
    );
  }

  private addRiskDetailsForGeneral(template: string, context: any): string {
    return template
      .replace('{{riskId}}', context.riskId)
      .replace('{{riskName}}', context.riskName)
      .replace('{{riskStatus}}', context.riskStatus.toUpperCase())
      .replace('{{approvedBy}}', context.approvedBy)
      .replace('{{comments}}', context.comments || 'No additional comments provided.')
      .replace(/{{baseUrl}}/g, this.frontendUrl);
  }

  //RESET PASSSWORD
  private async loadResetPasswordTemplate() {
    try {
      this.resetPasswordTemplate = await fetch(
        'Templates/ResetPasswordTemplate.html'
      ).then((response) => response.text());
    } catch (error) {
      console.error('Failed to load reset password template:', error);
    }
  }

  private prepareResetPasswordEmailBody(
    template: string,
    context: any
  ): string {
    const resetLink = `${this.frontendUrl}/resetpassword?token=${context.resetToken}&email=${context.email}`;
    return template
      .replace('{{fullName}}', context.fullName)
      .replace('{{resetPasswordLink}}', resetLink)
      .replace('{{ResetPage}}', resetLink)
      .replace(/{{baseUrl}}/g, this.frontendUrl);
  }

  sendResetPasswordEmail(email: string): Observable<boolean> {
    const resetToken =
      Math.random().toString(36).substring(2) + Date.now().toString(36);

    const context = {
      fullName: 'User',
      email: email,
      resetToken: resetToken,
    };

    const subject = 'RESET YOUR RISK MANAGEMENT SYSTEM PASSWORD';
    const body = this.prepareResetPasswordEmailBody(
      this.resetPasswordTemplate,
      context
    );

    return this.api.saveResetToken(email, resetToken).pipe(
      switchMap(() => this.api.sendMail(email, subject, body)),
      map((response: any) => {
        this.notificationService.success(
          'Password reset link has been sent to your email.'
        );
        return true;
      }),
      catchError((error) => {
        console.error('Error sending reset password email:', error);
        this.notificationService.error('Failed to send reset password email');
        return of(false);
      })
    );
  }

  //USER REGISTRATION EMAIL
  private async loadUserRegisterTemplate() {
    try {
      this.userRegisterTemplate = await fetch(
        'Templates/RegisterUserTemplate.html'
      ).then((response) => response.text());
    } catch (error) {
      console.error('Failed to load email template:', error);
    }
  }
  sendUserRegistrationEmail(email: string, context: any): Observable<boolean> {
    const subject = 'YOUR RISK MANAGEMENT SYSTEM ACCOUNT CREDENTIALS';
    const body = this.prepareUserRegistrationEmailBody(
      this.userRegisterTemplate,
      context
    );

    return this.api.sendMail(email, subject, body).pipe(
      map((response: any) => {
        return true;
      }),
      catchError((error) => {
        console.error('Detailed error sending registration email:', {
          error,
        });
        return of(false);
      })
    );
  }
  private prepareUserRegistrationEmailBody(
    template: string,
    context: any
  ): string {
    return template
      .replace(/{{userEmail}}/g, context.email)
      .replace('{{defaultPassword}}', context.defaultPassword)
      .replace(/{{fullName}}/g, context.fullName)
      .replace(/{{baseUrl}}/g, this.frontendUrl);
  }

  //REVIEW MAIL
  private async loadReviewTemplate() {
    try {
      this.reviewerEmailTemplate = await fetch(
        'Templates/ApprovalEmailTemplate.html'
      ).then((response) => response.text());
    } catch (error) {
      console.error('Failed to load email template:', error);
    }
  }
  private AddRiskDetailsForReview(template: string, context: any): string {
    return template
      .replace(/{{createdBy}}/g, this.authService.getUserName() || 'user')
      .replace('{{responsibleUser}}', context.responsibleUser)
      .replace('{{riskId}}', context.riskId)
      .replace('{{riskName}}', context.riskName)
      .replace('{{description}}', context.description)
      .replace('{{riskType}}', context.riskType)
      .replace('{{impact}}', context.impact)
      .replace('{{mitigation}}', context.mitigation)
      .replace('{{plannedActionDate}}', context.plannedActionDate)
      .replace('{{overallRiskRating}}', context.overallRiskRating)
      .replace('{{id}}', context.id)
      .replace('{{rid}}', context.rid)
      .replace(/{{baseUrl}}/g, this.frontendUrl);
  }
  sendReviewerEmail(email: string, context: any): Observable<boolean> {
    const subject = `RISK REVIEW NOTIFICATION - ${context.riskName}`;
    const body = this.AddRiskDetailsForReview(
      this.reviewerEmailTemplate,
      context
    );

    return this.api.sendMail(email, subject, body).pipe(
      map((response: any) => {
        console.log('Email sent successfully');
        this.notificationService.success(
          'The risk has been submitted to the reviewer for approval.'
        );
        return true;
      }),
      catchError((error) => {
        console.error('Error sending email:', error);
        this.notificationService.error('Failed to send email to reviewer');
        return of(false);
      })
    );
  }

  //ASSIGNEE MAIL
  private async loadAssigneeTemplate() {
    try {
      this.assigneeEmailTemplate = await fetch(
        'Templates/AssigneeEmailTemplate.html'
      ).then((response) => response.text());
    } catch (error) {
      console.error('Failed to load email template:', error);
    }
  }
  async prepareAssigneeEmail(context: any): Promise<string> {
    await this.getCreatedByUserName(context.riskId);
    // console.log('Username after fetch:', this.createdByUserName);

    return this.AddRiskDetailstoAssignee(this.assigneeEmailTemplate, context);
  }

  private AddRiskDetailstoAssignee(template: string, context: any): string {
    // console.log('Using username in template:', this.createdByUserName);

    return template

      .replace(/{{createdBy}}/g, this.createdByUserName)
      .replace('{{assigneeName}}', context.responsibleUser)
      .replace('{{riskId}}', context.riskId)
      .replace('{{riskName}}', context.riskName)
      .replace('{{description}}', context.description)
      .replace('{{riskType}}', context.riskType)
      .replace('{{plannedActionDate}}', context.plannedActionDate)
      .replace('{{overallRiskRating}}', context.overallRiskRating)
      .replace('{{riskStatus}}', context.riskStatus)
      .replace(/{{baseUrl}}/g, this.frontendUrl);
  }

  sendAssigneeEmail(email: string, context: any): Observable<boolean> {
    const subject = `RISK ASSIGNMENT NOTIFICATION - ${context.riskName}`;
    return from(this.prepareAssigneeEmail(context)).pipe(
      switchMap((body) => {
        return this.api.sendMail(email, subject, body);
      }),
      map((response: any) => {
        // console.log('Email sent successfully', response);
        this.notificationService.success(
          'Email sent to the responsible user successfully'
        );
        return true;
      }),
      catchError((error) => {
        console.error('Error sending email:', error);
        this.notificationService.error('Failed to send email to assignee');
        return of(false);
      })
    );
  }

  //RISK OWNER MAIL
  private async loadOwnerTemplate() {
    try {
      this.ownerEmailTemplate = await fetch(
        'Templates/RiskOwnerEmailTemplate.html'
      ).then((response) => response.text());
    } catch (error) {
      console.error('Failed to load email template:', error);
    }
  }

  async prepareOwnerEmail(context: any): Promise<string> {
    await this.getCreatedByUserName(context.riskId);
    // console.log('Username after fetch:', this.createdByUserName);

    return this.AddRiskDetailsForOwner(this.ownerEmailTemplate, context);
  }
  private AddRiskDetailsForOwner(template: string, context: any): string {
    // console.log('Using username in template:', this.createdByUserName);

    return template
      .replace(/{{createdBy}}/g, this.createdByUserName)
      .replace('{{reviewer}}', context.reviewer)
      .replace('{{responsibleUser}}', context.responsibleUser)
      .replace('{{riskId}}', context.riskId)
      .replace('{{riskName}}', context.riskName)
      .replace('{{description}}', context.description)
      .replace('{{riskType}}', context.riskType)
      .replace('{{impact}}', context.impact)
      .replace('{{mitigation}}', context.mitigation)
      .replace('{{plannedActionDate}}', context.plannedActionDate)
      .replace('{{overallRiskRating}}', context.overallRiskRating)
      .replace('{{reason}}', context.reason)
      .replace(/{{baseUrl}}/g, this.frontendUrl);
  }
  sendOwnerEmail(email: string, context: any): Observable<boolean> {
    const subject = `RISK REVIEW REJECTED - ${context.riskName}`;
    return from(this.prepareOwnerEmail(context)).pipe(
      switchMap((body) => {
        return this.api.sendMail(email, subject, body);
      }),
      map((response: any) => {
        // console.log('Email sent successfully', response);
        this.notificationService.success(
          'Notify the risk owner that the risk has been rejected.'
        );
        return true;
      }),
      catchError((error) => {
        console.error('Error sending email:', error);
        this.notificationService.error('Failed to send email to risk owner');
        return of(false);
      })
    );
  }

  //USER UPADTE EMAIL
  private async loadUserUpdateTemplate() {
    try {
      this.userUpdateTemplate = await fetch(
        'Templates/UpdateUserEmailTemplate.html'
      ).then((response) => response.text());
    } catch (error) {
      console.error('Failed to load user update email template:', error);
    }
  }

  sendUserUpdateEmail(email: string, context: any): Observable<boolean> {
    const subject = ' RISK MANAGEMENT SYSTEM ACCOUNT UPDATE';
    const body = this.prepareUserUpdateEmailBody(
      this.userUpdateTemplate,
      context
    );

    return this.api.sendMail(email, subject, body).pipe(
      map((response: any) => {
        // console.log('Update email sent successfully', response);
        return true;
      }),
      catchError((error) => {
        console.error('Detailed error sending update email:', {
          error,
        });
        return of(false);
      })
    );
  }

  private prepareUserUpdateEmailBody(template: string, context: any): string {
    // console.log('Email context:', context);
    let updatedTemplate = template
      .replace(/{{userEmail}}/g, context.email)
      .replace(/{{fullName}}/g, context.fullName || 'User')
      .replace(/{{departmentName}}/g, context.departmentName || 'Not specified')
      .replace(/{{baseUrl}}/g, this.frontendUrl);

    if (
      context.projects &&
      Array.isArray(context.projects) &&
      context.projects.length > 0
    ) {
      let projectsList = '';
      context.projects.forEach((project: any) => {
        const projectName =
          typeof project === 'object'
            ? project.name || 'Unnamed project'
            : project;
        projectsList += `<li>${projectName}</li>`;
      });
      updatedTemplate = updatedTemplate.replace(
        '<!-- PROJECT_LIST_PLACEHOLDER -->',
        projectsList
      );
      updatedTemplate = updatedTemplate
        .replace('{{#if projects.length}}', '')
        .replace('{{else}}', '<!--')
        .replace('{{/if}}', '-->');
    } else {
      updatedTemplate = updatedTemplate
        .replace('{{#if projects.length}}', '<!--')
        .replace('<!-- PROJECT_LIST_PLACEHOLDER -->', '')
        .replace('{{else}}', '-->')
        .replace('{{/if}}', '');
    }

    return updatedTemplate;
  }

  //POST REVIEW EMAIL
  private async loadPostTemplate() {
    try {
      this.postreviewerEmailTemplate = await fetch(
        'Templates/PostApprovalEmailTemplate.html'
      ).then((response) => response.text());
    } catch (error) {
      console.error('Failed to load email template:', error);
    }
  }
  private AddRiskDetailsForPostReview(template: string, context: any): string {
    return template
      .replace(/{{createdBy}}/g, this.authService.getUserName() || 'user')
      .replace('{{responsibleUser}}', context.responsibleUser)
      .replace('{{riskId}}', context.riskId)
      .replace('{{riskName}}', context.riskName)
      .replace('{{description}}', context.description)
      .replace('{{riskType}}', context.riskType)
      .replace('{{impact}}', context.impact)
      .replace('{{mitigation}}', context.mitigation)
      .replace('{{plannedActionDate}}', context.plannedActionDate)
      .replace('{{riskOwner}}', context.riskOwner)
      .replace('{{overallRiskRating}}', context.overallRiskRating)
      .replace('{{riskStatus}}', context.riskStatus)
      .replace(/{{riskResponse}}/g, context.riskresponse)
      .replace('{{id}}', context.id)
      .replace('{{rid}}', context.rid)
      .replace(/{{baseUrl}}/g, this.frontendUrl);
  }
  sendPostReviewerEmail(email: string, context: any): Observable<boolean> {
    const subject = `RISK REVIEW POST IMPLEMENTATION OF ACTION PLAN  - ${context.riskName}`;
    const body = this.AddRiskDetailsForPostReview(
      this.postreviewerEmailTemplate,
      context
    );

    return this.api.sendMail(email, subject, body).pipe(
      map((response: any) => {
        // console.log('Email sent successfully', response);
        this.notificationService.success(
          'The risk has been submitted to the reviewer for approval.'
        );
        return true;
      }),
      catchError((error) => {
        console.error('Error sending email:', error);
        this.notificationService.error('Failed to send email to reviewer');
        return of(false);
      })
    );
  }

  //RISK OWNERMAIL AFTER APPROVAL
  private async loadApprovalTemplate() {
    try {
      this.approvalEmailTemplate = await fetch(
        'Templates/RiskApprovalEmailTemplate.html'
      ).then((response) => response.text());
    } catch (error) {
      console.error('Failed to load approval email template:', error);
    }
  }

  async prepareApprovalEmail(context: any): Promise<string> {
    await this.getCreatedByUserName(context.riskId);
    // console.log('Username after fetch:', this.createdByUserName);

    return this.addRiskDetailsForApproval(this.approvalEmailTemplate, context);
  }

  private addRiskDetailsForApproval(template: string, context: any): string {
    // console.log('Using username in template:', this.createdByUserName);

    return template
      .replace(/{{createdBy}}/g, this.createdByUserName)
      .replace('{{responsibleUser}}', context.responsibleUser)
      .replace('{{riskId}}', context.riskId)
      .replace('{{riskName}}', context.riskName)
      .replace('{{description}}', context.description)
      .replace('{{riskType}}', context.riskType)
      .replace('{{impact}}', context.impact)
      .replace('{{mitigation}}', context.mitigation)
      .replace('{{plannedActionDate}}', context.plannedActionDate)
      .replace('{{overallRiskRating}}', context.overallRiskRating)
      .replace('{{approvedBy}}', context.approvedBy || context.responsibleUser)
      .replace(
        '{{comments}}',
        context.comments || 'No additional comments provided.'
      )
      .replace(/{{baseUrl}}/g, this.frontendUrl);
  }

  sendApprovalEmail(email: string, context: any): Observable<boolean> {
    const subject = `RISK APPROVED - ${context.riskName}`;
    return from(this.prepareApprovalEmail(context)).pipe(
      switchMap((body) => {
        return this.api.sendMail(email, subject, body);
      }),
      map((response: any) => {
        // console.log('Email sent successfully', response);
        this.notificationService.success(
          'Risk owner has been notified of the approval.'
        );
        return true;
      }),
      catchError((error) => {
        console.error('Error sending approval email:', error);
        this.notificationService.error(
          'Failed to send approval email to risk owner'
        );
        return of(false);
      })
    );
  }

  //RISKCLOSE EMAIL

  private async loadRiskClosureTemplate() {
    try {
      this.riskClosureTemplate = await fetch(
        'Templates/RiskCloseEmailTemplate.html'
      ).then((response) => response.text());
    } catch (error) {
      console.error('Failed to load risk closure email template:', error);
    }
  }

  async prepareRiskClosureEmail(context: any): Promise<string> {
    await this.getCreatedByUserName(context.riskId);
    return this.addRiskDetailsForClosure(this.riskClosureTemplate, context);
  }

  private addRiskDetailsForClosure(template: string, context: any): string {
    return template
      .replace(
        /{{createdBy}}/g,
        context.responsibleUser || this.createdByUserName
      )
      .replace('{{riskId}}', context.riskId)
      .replace('{{riskName}}', context.riskName)
      .replace('{{description}}', context.description)
      .replace('{{riskType}}', context.riskType)
      .replace(
        '{{riskRating}}',
        context.initialRiskRating || context.overallRiskRating
      )
      .replace(
        '{{verifiedBy}}',
        context.verifiedBy || this.authService.getUserName()
      )
      .replace(
        '{{verificationComments}}',
        context.verificationComments || 'No additional comments provided.'
      )
      .replace(/{{baseUrl}}/g, this.frontendUrl);
  }

  sendRiskClosureEmail(email: string, context: any): Observable<boolean> {
    const subject = `RISK CLOSED - ${context.riskName}`;
    return from(this.prepareRiskClosureEmail(context)).pipe(
      switchMap((body) => {
        return this.api.sendMail(email, subject, body);
      }),
      map((response: any) => {
        this.notificationService.success(
          'Risk owner has been notified of the successful closure.'
        );
        return true;
      }),
      catchError((error) => {
        console.error('Error sending risk closure email:', error);
        this.notificationService.error(
          'Failed to send closure notification to risk owner'
        );
        return of(false);
      })
    );
  }
}

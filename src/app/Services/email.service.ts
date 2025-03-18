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
  postreviewerEmailTemplate:string ='';
  assigneeEmailTemplate: string = '';
  ownerEmailTemplate: string = '';
  userRegisterTemplate: string = '';
  resetPasswordTemplate: string = '';
  userUpdateTemplate: string = '';

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
        }
      });
    });
  }

  //Reset passsword
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

    const subject = 'Reset Your Risk Management System Password';
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

  // user Registration Email
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
    const subject = 'Your Risk Management System Account Credentials';
    const body = this.prepareUserRegistrationEmailBody(
      this.userRegisterTemplate,
      context
    );

    return this.api.sendMail(email, subject, body).pipe(
      map((response: any) => {
        // console.log('Registration email sent successfully', response);
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
      .replace('{{userEmail}}', context.email)
      .replace('{{defaultPassword}}', context.defaultPassword)
      .replace(/{{fullName}}/g, context.fullName)
      .replace(/{{baseUrl}}/g, this.frontendUrl);
  }

  //Review mail
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
    return (
      template
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
        .replace(/{{baseUrl}}/g, this.frontendUrl)
    );
  }
  sendReviewerEmail(email: string, context: any): Observable<boolean> {
    const subject = `RISK REVIEW NOTIFICATION - ${context.riskName}`;
    const body = this.AddRiskDetailsForReview(
      this.reviewerEmailTemplate,
      context
    );

    return this.api.sendMail(email, subject, body).pipe(
      map((response: any) => {
        console.log('Email sent successfully', response);
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

  //Assignee Mail
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
  console.log('Username after fetch:', this.createdByUserName);

  return this.AddRiskDetailstoAssignee(this.assigneeEmailTemplate, context);
}

  private AddRiskDetailstoAssignee(template: string, context: any): string {
    console.log('Using username in template:', this.createdByUserName);


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
    switchMap(body => {
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

  //Risk Owner mail
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
  console.log('Username after fetch:', this.createdByUserName);

  return this.AddRiskDetailsForOwner(this.ownerEmailTemplate, context);
}
  private AddRiskDetailsForOwner(template: string, context: any): string {
    console.log('Using username in template:', this.createdByUserName);

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
      .replace('{{reason}}', context.reason)
      .replace(/{{baseUrl}}/g, this.frontendUrl);
  }
  sendOwnerEmail(email: string, context: any): Observable<boolean> {
    const subject = `RISK REVIEW REJECTED - ${context.riskName}`;
    return from(this.prepareOwnerEmail(context)).pipe(
      switchMap(body => {

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

  //User Upadte Email
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
    const subject = ' Risk Management System Account Update';
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
    console.log('Email context:', context);
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




//PostReviewEmail
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
  return (
    template
      .replace(/{{createdBy}}/g, this.authService.getUserName() || 'user')
      .replace('{{responsibleUser}}', context.responsibleUser)
      .replace('{{riskId}}', context.riskId)
      .replace('{{riskName}}', context.riskName)
      .replace('{{description}}', context.description)
      .replace('{{riskType}}', context.riskType)
      .replace('{{impact}}', context.impact)
      .replace('{{mitigation}}', context.mitigation)
      .replace('{{plannedActionDate}}', context.plannedActionDate)
      .replace('{{riskOwner}}',context.riskOwner)
      .replace('{{overallRiskRating}}', context.overallRiskRating)
      .replace(/{{riskResponse}}/g, context.riskresponse)
      .replace('{{id}}', context.id)
      .replace('{{rid}}', context.rid)
      .replace(/{{baseUrl}}/g, this.frontendUrl)
  );
}
sendPostReviewerEmail(email: string, context: any): Observable<boolean> {
  const subject = `RISK POST REVIEW NOTIFICATION - ${context.riskName}`;
  const body = this.AddRiskDetailsForPostReview(
    this.postreviewerEmailTemplate,
    context
  );
  // console.log("context checkkkk:::::" , context)
  // console.log("body check " , body)


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

}

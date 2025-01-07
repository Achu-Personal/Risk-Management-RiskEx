import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  emailTemplate: string = '';
  constructor(private api: ApiService) {
    this.loadReviewTemplate();
    this.loadAssigneeTemplate();
  }

  private async loadReviewTemplate() {
    try {

      this.emailTemplate = await fetch('Templates/ApprovalEmailTemplate.html')
        .then(response => response.text());
    } catch (error) {
      console.error('Failed to load email template:', error);
    }
  }
  private AddRiskDetailsForReview(template:string,context:any):string{
    return template
      .replace('{{responsibleUser}}', context.responsibleUser)
      .replace('{{riskId}}', context.riskId)
      .replace('{{riskName}}', context.riskName)
      .replace('{{description}}', context.description)
      .replace('{{riskType}}', context.riskType)
      .replace('{{plannedActionDate}}', context.plannedActionDate)
      .replace('{{overallRiskRating}}', context.overallRiskRating)
      .replace('{{id}}', context.id)

  }
  sendReviewerEmail(email: string, context:any): Observable<boolean> {
    const subject = `Review Risk - ${context.riskName}`;
    const body = this.AddRiskDetailsForReview(this.emailTemplate, context);

    return this.api.sendMail(email, subject, body).pipe(
      map((response:any) => {
        console.log('Email sent successfully', response);
        alert('Email sent successfully');
        return true; // Return success
      }),
      catchError((error) => {
        console.error('Error sending email:', error);
        alert('Failed to send email');
        return of(false); // Return failure
      })
    );
  }


  private async loadAssigneeTemplate() {
    try {
        this.emailTemplate = await fetch('Templates/AssigneeEmailTemplate.html')
            .then(response => response.text());
        console.log('Loaded Template:', this.emailTemplate); // Debug log
    } catch (error) {
        console.error('Failed to load email template:', error);
    }
}


  private AddRiskDetailstoAssignee(template:string,context:any):string{
    return template
      .replace('{{assigneeName}}', context.responsibleUser)
      .replace('{{riskId}}', context.riskId)
      .replace('{{riskName}}', context.riskName)
      .replace('{{description}}', context.description)
      .replace('{{riskType}}', context.riskType)
      .replace('{{plannedActionDate}}', context.plannedActionDate)
      .replace('{{overallRiskRating}}', context.overallRiskRating)
      .replace('{{riskStatus}}', context.riskStatus);
  }
  // sendAssigneeEmail(email: string, context:any): Observable<boolean> {
  //   const subject = `Review Risk - ${context.riskName}`;
  //   const body = this.AddRiskDetailstoAssignee(this.emailTemplate, context);

  //   return this.api.sendMail(email, subject, body).pipe(
  //     map((response:any) => {
  //       console.log('Email sent successfully', response);
  //       alert('Email sent successfully');
  //       return true; // Return success
  //     }),
  //     catchError((error) => {
  //       console.error('Error sending email:', error);
  //       alert('Failed to send email');
  //       return of(false); // Return failure
  //     })
  //   );
  // }

  // sendReviewEmail(riskId: number, reviewId: number, reviewerEmail: string) {
  //   return this.http.post(`https://localhost:7216/api/emails/send-review-email?riskId=${riskId}&reviewId=${reviewId}&reviewerEmail=${reviewerEmail}`, {});
  // }

  sendAssigneeEmail(email: string, context: any): Observable<boolean> {
    const subject = `Review Risk - ${context.riskName}`;
    const body = this.AddRiskDetailstoAssignee(this.emailTemplate, context);

    console.log('Email Subject:', subject); // Debug log
    console.log('Email Body:', body);       // Debug log

    return this.api.sendMail(email, subject, body).pipe(
        map((response: any) => {
            console.log('Email sent successfully', response);
            alert('Email sent successfully');
            return true;
        }),
        catchError((error) => {
            console.error('Error sending email:', error);
            alert('Failed to send email');
            return of(false);
        })
    );
}

}

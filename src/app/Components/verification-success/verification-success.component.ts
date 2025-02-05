import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmailService } from '../../Services/email.service';

@Component({
  selector: 'app-verification-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verification-success.component.html',
  styleUrl: './verification-success.component.scss'
})
export class VerificationSuccessComponent {
  isResending = false;
  emailAddress: string = '';

  constructor(
    private router: Router,
    private emailService: EmailService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.emailAddress = navigation?.extras?.state?.['email'] || localStorage.getItem('resetEmail') || '';
  }

  resendEmail(): void {
    if (this.emailAddress && !this.isResending) {
      this.isResending = true;
      this.emailService.sendResetPasswordEmail(this.emailAddress).subscribe({
        next: (success) => {
          if (success) {
            console.log('Reset email resent successfully');
          }
        },
        error: (error) => {
          console.error('Error resending reset email:', error);
        },
        complete: () => {
          this.isResending = false;
        }
      });
    }
  }

  backToLogin(): void {
    this.router.navigate(['/auth']);
  }
}

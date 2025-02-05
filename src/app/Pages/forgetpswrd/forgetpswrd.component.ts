import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { EmailService } from '../../Services/email.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgetpswrd',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgetpswrd.component.html',
  styleUrl: './forgetpswrd.component.scss',
})
export class ForgetpswrdComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;

  constructor(
    private api: ApiService,
    private emailService: EmailService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.forgotPasswordForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      const email = this.forgotPasswordForm.get('email')?.value;

      this.emailService.sendResetPasswordEmail(email).subscribe({
        next: (success) => {
          if (success) {
            localStorage.setItem('resetEmail', email);
            this.router.navigate(['/verification-success'], {
              state: { email: email },
            });
          }
        },
        error: (error) => {
          console.error('Error sending reset email:', error);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    } else {
      Object.keys(this.forgotPasswordForm.controls).forEach((key) => {
        const control = this.forgotPasswordForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}

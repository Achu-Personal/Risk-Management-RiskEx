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

  navigateToReset() {
    this.router.navigate(['/resetpassword']);
  }

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

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.get('email')?.value;

      this.emailService.sendResetPasswordEmail(email).subscribe((success) => {
        if (success) {
          // Navigate to a confirmation page or show success message
          this.router.navigate(['/reset-confirmation']);
        }
      });
    }
  }
}

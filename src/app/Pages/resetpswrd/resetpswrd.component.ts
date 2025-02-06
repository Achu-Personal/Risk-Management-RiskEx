import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { NotificationService } from '../../Services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resetpswrd',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './resetpswrd.component.html',
  styleUrl: './resetpswrd.component.scss',
})
export class ResetpswrdComponent implements OnInit {
  resetForm: FormGroup;
  token: string = '';
  email: string = '';
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private notificationService: NotificationService
  ) {
    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      this.email = params['email'];

      if (!this.token || !this.email) {
        this.notificationService.error('Invalid reset link');
        this.router.navigate(['/auth']);
      }
    });
  }

  togglePasswordVisibility(field: 'password' | 'confirm') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.resetForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.valid) {
      this.isLoading = true;
      const payload = {
        email: this.email,
        token: this.token,
        newPassword: this.resetForm.get('password')?.value,
      };

      this.api.resetPassword(payload).subscribe({
        next: (response) => {
          this.notificationService.success('Password reset successful');
          this.router.navigate(['/auth']);
        },
        error: (error) => {
          this.notificationService.error(
            error.message || 'Password reset failed'
          );
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    } else {
      Object.keys(this.resetForm.controls).forEach((key) => {
        const control = this.resetForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  navigateTologin() {
    this.router.navigate(['/auth']);
  }
}

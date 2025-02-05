import { Component } from '@angular/core';
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
export class ResetpswrdComponent {
  resetForm: FormGroup;
  token: string = '';
  email: string = '';

  navigateTologin() {
    this.router.navigate(['/auth']);
  }

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
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.valid) {
      const payload = {
        email: this.email,
        token: this.token,
        newPassword: this.resetForm.get('password')?.value,
      };
      console.log(payload);

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
      });
    }
  }
}

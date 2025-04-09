import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { NotificationService } from '../../Services/notification.service';

@Component({
  selector: 'app-changepassword',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './changepassword.component.html',
  styleUrl: './changepassword.component.scss',
})
export class ChangepasswordComponent {
  @Output() close = new EventEmitter<void>();
  @Input() isVisible = false;
  @Output() closeModal = new EventEmitter<void>();

  changePasswordForm: FormGroup;
  passwordChanged = false;
  errorMessage: string = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public api: ApiService,
    private notification: NotificationService
  )
  {
    this.changePasswordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
          ],
        ],
        confirmPassword: [''],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')!.value === form.get('confirmPassword')!.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.changePasswordForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const { currentPassword, newPassword, confirmPassword } =
      this.changePasswordForm.value;

    this.api
      .changePassword(currentPassword, newPassword, confirmPassword)
      .subscribe({
        next: (response) => {
          this.passwordChanged = true;
          this.notification.success('Password changed successfully');
          this.close.emit();
          this.navigateToHome();
          this.changePasswordForm.reset();
        },
        error: (error) => {
          this.isSubmitting = false;
          if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage =
              'Incorrect Password or an error occurred while changing the password';
          }
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
  }
  navigateToHome() {
    this.router.navigate(['/home']);
  }

  onCancel() {
    this.changePasswordForm.reset();
    this.errorMessage = '';
    this.close.emit();
  }
}

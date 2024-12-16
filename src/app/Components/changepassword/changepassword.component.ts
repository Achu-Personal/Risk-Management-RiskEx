import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changepassword',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './changepassword.component.html',
  styleUrl: './changepassword.component.scss'
})
export class ChangepasswordComponent {

  @Output() close = new EventEmitter<void>();
  changePasswordForm: FormGroup;
  passwordChanged = false;

  constructor(
    private fb: FormBuilder,private router: Router
    // private emailService: EmailNotificationService
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: [
        '',
        [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)],
      ],
      confirmPassword: [''],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')!.value === form.get('confirmPassword')!.value
      ? null
      : { mismatch: true };
  }


  navigateTohome() {
    this.router.navigate(['/home']);

  }
  onSubmit() {
    if (this.changePasswordForm.invalid) {
      return;
    }

    // Simulate password update and email notification
    const { currentPassword, newPassword } = this.changePasswordForm.value;
    console.log(`Password Updated: ${newPassword}`);

    // this.emailService.sendPasswordChangeEmail();
    alert('Your password has been changed successfully.');
    this.passwordChanged = true;

    this.close.emit(); // Close popup after success
  }

  onCancel() {
    this.close.emit();
  }

}

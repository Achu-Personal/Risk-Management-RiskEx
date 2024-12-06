import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgetpswrd',
  standalone: true,
  imports: [],
  templateUrl: './forgetpswrd.component.html',
  styleUrl: './forgetpswrd.component.scss'
})
export class ForgetpswrdComponent {

  forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      console.log('Form Submitted', this.forgotPasswordForm.value);
      // Add your backend API integration here
    }
  }
}

import { Component } from '@angular/core';
import { FormBuilder,  FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  showError = false;
  errorMessage: string = "";
  isLoading = false;

  constructor(
    private authServices: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  clearError() {
    this.showError = false;
    this.errorMessage = "";
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.clearError();
      this.authServices.login(this.loginForm.value).subscribe(
        (response) => {
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.showError = true;
          this.errorMessage = error; // Use the error message from the backend
        }
      );
    }
  }
}

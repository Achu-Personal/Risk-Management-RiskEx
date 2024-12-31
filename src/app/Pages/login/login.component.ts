import { Component } from '@angular/core';
import { FormBuilder,  FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  showError = false;

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
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authServices.login(this.loginForm.value).subscribe(
        (response) => {
          this.showError = false;
        },
        (error) => {
          this.showError = true;
        }
      );
    }
  }
}

import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private jwtHelper = new JwtHelperService();



  loginForm: FormGroup;
  showError = false;
  errorMessage: string = "";
  isLoading = false;
  showPassword = false;

  constructor(
    private authServices: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  clearError() {
    this.showError = false;
    this.errorMessage = "";
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tokenFromParams = params['token'];
      if (tokenFromParams) {
        this.handleSSOLogin(tokenFromParams);
      }
    });
  }

  private handleSSOLogin(token: string) {
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const email = decodedToken.email;

      if (email) {
        this.isLoading = true;
        // Call login with email only for SSO
        this.authServices.login({ email }).subscribe({
          next: (response) => {
            this.isLoading = false;
            // Handle successful login - navigation will likely be handled in the auth service
          },
          error: (error) => {
            this.isLoading = false;
            this.showError = true;
            this.errorMessage = "SSO login failed. Please try again or use manual login.";
            console.error('SSO login error:', error);
          }
        });
      }
    } catch (error) {
      console.error('Error processing SSO token:', error);
      this.showError = true;
      this.errorMessage = "Invalid SSO token. Please try again or use manual login.";
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.clearError();
      this.authServices.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.showError = true;
          this.errorMessage = error;
        }
      });
    }
  }
}

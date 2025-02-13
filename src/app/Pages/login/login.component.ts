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
    // Check if there's a token in localStorage from Microsoft SSO
    const msalToken = localStorage.getItem('loginToken');
    if (msalToken) {
      this.handleSSOLogin(msalToken);
    }

    // Also check URL params for token
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
      // Try different possible locations for email in MSAL token
      const email = decodedToken.email ||
                   decodedToken.preferred_username ||
                   decodedToken.upn ||
                   decodedToken.unique_name;

      if (email) {
        this.isLoading = true;
        // Call login with just the email
        this.authServices.login({
          email: email,
          password: token  // Pass the token as password for SSO
        }).subscribe({
          next: (response) => {
            this.isLoading = false;
            // Login successful - navigation handled in auth service
          },
          error: (error) => {
            this.isLoading = false;
            this.showError = true;
            this.errorMessage = "User not found or not authorized. Please contact administrator.";
            console.error('SSO login error:', error);
            localStorage.removeItem('loginToken');
          }
        });
      } else {
        throw new Error('Email not found in token');
      }
    } catch (error) {
      console.error('Error processing SSO token:', error);
      this.showError = true;
      this.errorMessage = "SSO authentication failed. Please try manual login.";
      localStorage.removeItem('loginToken');
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

import { Component } from '@angular/core';
import { FormBuilder,  FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { NgIf } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  showError = false;
  errorMessage: string = "";
  isLoading = false;
  showPassword = false;

  userRoleData: any;


  constructor(
    private authServices: AuthService,
    private fb: FormBuilder,
    private router: Router,
        private msalService: MsalService, // MSAL for handling authentication
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
 async ngOnInit(): Promise<void> {
    try {
      await this.msalService.instance.initialize();

      // ✅ Handle MSAL redirect response (this resolves login redirect state)
      const result = await this.msalService.instance.handleRedirectPromise();

      if (result) {
        console.log('Login successful via redirect:', result);
        this.msalService.instance.setActiveAccount(result.account);
        localStorage.setItem('loginToken', result.accessToken);
        console.log("dai vanna ni",result.accessToken);

        // ✅ Send token to backend
        await this.ssoLoginToBackend(result.accessToken);
        return;
      }

      // ✅ Check if user is already logged in
      const account = this.msalService.instance.getActiveAccount();
      if (account) {
        console.log('Session active:', account);

        // Try to silently acquire token
        const tokenResponse = await firstValueFrom(
          this.msalService.acquireTokenSilent({ scopes: ['user.read'], account })
        );

        if (tokenResponse?.accessToken) {
          localStorage.setItem('loginToken', tokenResponse.accessToken);
          await this.ssoLoginToBackend(tokenResponse.accessToken);
        }
      } else {
        // ✅ Only call loginRedirect() if no active session exists
        console.log('No active session. Redirecting to login...');
        // this.msalService.loginRedirect();
      }
    } catch (error) {
      console.error('SSO Login Error:', error);
      // this.msalService.loginRedirect();
    }
  }

  async ssoLoginToBackend(token: string): Promise<void> {
    try {
      const response = await firstValueFrom(this.authServices.ssoLogin(token));

      if (response?.token) {
        this.userRoleData = response;
        localStorage.setItem('userDetails', JSON.stringify(this.userRoleData));
        localStorage.setItem('apiToken', this.userRoleData.token);

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      } else {
        console.error('Invalid response from backend:', response);
      }
    } catch (error) {
      console.error('Error sending SSO token to backend:', error);
    }
  }
}

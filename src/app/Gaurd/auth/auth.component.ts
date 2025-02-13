import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { ApiService } from '../../Services/api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  userRoleData: any;
  isLoading = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private msalService: MsalService, // MSAL for handling authentication
    private api: ApiService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.msalService.instance.initialize();
 
      // ✅ Handle MSAL redirect response (this resolves login redirect state)
      const result = await this.msalService.instance.handleRedirectPromise();

      if (result) {
        console.log('Login successful via redirect:', result);
        this.msalService.instance.setActiveAccount(result.account);
        localStorage.setItem('loginToken', result.accessToken);

        // ✅ Send token to backend
        await this.ssoLoginToBackend(result.accessToken);
        return;
      }

      // ✅ Check if user is already logged in
      const account = this.msalService.instance.getActiveAccount();
      if (account) {
        console.log('Session active:', account);

        // Try to silently acquire token
        const tokenResponse = await this.msalService.acquireTokenSilent({
          scopes: ['user.read'],
          account
        }).toPromise();

        if (tokenResponse?.accessToken) {
          localStorage.setItem('loginToken', tokenResponse.accessToken);
          await this.ssoLoginToBackend(tokenResponse.accessToken);
        }
      } else {
        // ✅ Only call loginRedirect() if no active session exists
        console.log('No active session. Redirecting to login...');
        this.msalService.loginRedirect();
      }
    } catch (error) {
      console.error('SSO Login Error:', error);
      this.msalService.loginRedirect();
    }
  }

  async ssoLoginToBackend(token: string): Promise<void> {
    try {
      const response = await firstValueFrom(this.authService.ssoLogin(token));

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

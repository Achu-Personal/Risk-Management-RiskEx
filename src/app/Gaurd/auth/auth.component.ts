import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth/auth.service';
import { MsalService } from '@azure/msal-angular';
import {  firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponentSSO {
  userRoleData: any;
  isLoading = true;
  usermail: string = '';
  errorMessage: string = "";
  showError = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private msalService: MsalService,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.isLoading = true;
      await this.msalService.instance.initialize();

      const result = await this.msalService.instance.handleRedirectPromise();

      if (result) {
        console.log('Login successful via redirect:', result);
        this.msalService.instance.setActiveAccount(result.account);
        localStorage.setItem('loginToken', result.accessToken);
        this.usermail = result.account.username;
        await this.ssoLoginToBackend(this.usermail);
        return;
      }

      const account = this.msalService.instance.getActiveAccount();
      if (account) {
        console.log('Session active:', account);
        this.usermail = account.username;
        console.log(' active account:', this.usermail);


        try {
          const tokenResponse = await firstValueFrom(
            this.msalService.acquireTokenSilent({
              scopes: ['user.read'],
              account
            })
          );

          if (tokenResponse?.accessToken) {
            localStorage.setItem('loginToken', tokenResponse.accessToken);
            await this.ssoLoginToBackend(this.usermail);
          }
        } catch (error) {
          console.error('Token acquisition failed:', error);
          this.handleError('Failed to acquire authentication token. Please try again.');
        }
      } else {
        console.log('No active session. Redirecting to login...');
        // this.msalService.loginRedirect();
        this.router.navigate(['/sso']);
      }
    } catch (error) {
      console.error('SSO Login Error:', error);
      this.handleError('Authentication failed. Please try again.');
      this.msalService.loginRedirect();
    } finally {
      this.isLoading = false;
    }
  }

  async ssoLoginToBackend(usermail: string) {
    if (!usermail) {
      this.handleError('User email is missing');
      return;
    }
    try {
      this.isLoading = true;
      await firstValueFrom(this.authService.ssoLogin(usermail));
      console.log("SSO login successful!");
    }catch (error: any) {
      const errorMessage = error;
      console.error("Error sending SSO email to backend:", errorMessage);
      this.handleError(errorMessage);
    } finally {
      this.isLoading = false;
    }
  }


  private handleError(message:string) {
    this.errorMessage = message;
    this.showError = true;
    this.isLoading = false;
  }

  retryLogin() {
    this.showError = false;
    this.errorMessage = '';
    this.msalService.loginRedirect();
  }

  ngOnDestroy() {
    this.isLoading = false;
  }
}

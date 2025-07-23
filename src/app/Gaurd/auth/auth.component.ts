import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth/auth.service';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { firstValueFrom, filter, take } from 'rxjs';
import { InteractionStatus } from '@azure/msal-browser';

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
  isLoggingOut = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(params => {
      if (params['logout'] === 'true') {
        this.isLoggingOut = true;
        this.router.navigate(['/sso'], { queryParams: { logout: 'true' } });
        return;
      }
    });

    if (this.isLoggingOut) return;

    try {
      this.isLoading = true;
      await this.msalService.instance.initialize();

      // Wait for any ongoing interaction to complete
      await this.waitForInteractionToComplete();

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
        this.usermail = account.username;

        try {
          // Wait for interaction to complete before acquiring token
          await this.waitForInteractionToComplete();

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
        // Check if we still have a loginToken but no active account
        if (localStorage.getItem('loginToken')) {
          localStorage.removeItem('loginToken');
        }
        this.router.navigate(['/sso']);
      }
    } catch (error) {
      console.error('SSO Login Error:', error);
      this.handleError('Authentication failed. Please try again.');

      if (!this.isLoggingOut) {
        // this.router.navigate(['/sso']);
      }
    } finally {
      this.isLoading = false;
    }
  }

  // Helper method to wait for interaction to complete using broadcast service
  private async waitForInteractionToComplete(): Promise<void> {
    return new Promise((resolve) => {
      // First check current status
      this.msalBroadcastService.inProgress$
        .pipe(
          filter((status: InteractionStatus) => status === InteractionStatus.None),
          take(1)
        )
        .subscribe(() => {
          resolve();
        });
    });
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
    } catch (error: any) {
      const errorMessage = error;
      console.error("Error sending SSO email to backend:", errorMessage);
      this.handleError(errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  private handleError(message: string) {
    this.errorMessage = message;
    this.showError = true;
    this.isLoading = false;
  }

  async retryLogin() {
    this.showError = false;
    this.errorMessage = '';
    // Only redirect if not already logging out
    if (!this.isLoggingOut) {
      // Wait for any ongoing interaction to complete before retrying
      await this.waitForInteractionToComplete();
      this.msalService.loginRedirect();
    }
  }

  ngOnDestroy() {
    this.isLoading = false;
  }
}

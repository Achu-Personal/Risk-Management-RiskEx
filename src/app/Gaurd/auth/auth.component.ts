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
  ) { }

  async ngOnInit(): Promise<void> {
  console.log('AuthComponentSSO - ngOnInit started');

  this.route.queryParams.subscribe(params => {
    console.log('Query params:', params);
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
    console.log('MSAL initialized');

    await this.waitForInteractionToComplete();
    console.log('Interaction complete');

    const result = await this.msalService.instance.handleRedirectPromise();
    console.log('Redirect result:', result);

    if (result) {
      console.log('Login successful via redirect:', result);
      this.msalService.instance.setActiveAccount(result.account);
      localStorage.setItem('loginToken', result.accessToken);
      this.usermail = result.account.username;
      console.log('Calling backend with email:', this.usermail);
      await this.ssoLoginToBackend(this.usermail);
      return;
    }

    const account = this.msalService.instance.getActiveAccount();
    console.log('Active account:', account);

    if (account) {
      this.usermail = account.username;
      console.log('User email:', this.usermail);

      try {
        await this.waitForInteractionToComplete();

        const tokenResponse = await firstValueFrom(
          this.msalService.acquireTokenSilent({
            scopes: ['user.read'],
            account
          })
        );
        console.log('Token response:', tokenResponse);

        if (tokenResponse?.accessToken) {
          localStorage.setItem('loginToken', tokenResponse.accessToken);
          console.log('Calling backend with email:', this.usermail);
          await this.ssoLoginToBackend(this.usermail);
        }
      } catch (error) {
        console.error('Token acquisition failed:', error);
        this.handleError('Failed to acquire authentication token. Please try again.');
      }
    } else {
      console.log('No active account found');
      if (localStorage.getItem('loginToken')) {
        localStorage.removeItem('loginToken');
      }
      this.router.navigate(['/sso']);
    }
  } catch (error) {
    console.error('SSO Login Error:', error);
    this.handleError('Authentication failed. Please try again.');
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

  this.isLoading = true;

  // Don't use firstValueFrom, just subscribe
  this.authService.ssoLogin(usermail).subscribe({
    next: (response) => {
      console.log("SSO login successful!", response);
      // Navigation is handled by the service
      this.isLoading = false;
    },
    error: (error) => {
      console.error("Error sending SSO email to backend:", error);
      this.handleError(error || 'Authentication failed. Please try again.');
      this.isLoading = false;
    }
  });
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

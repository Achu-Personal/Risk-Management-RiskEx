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
    console.log('🔵 AuthComponentSSO - ngOnInit started');
    console.log('🔵 Current URL:', this.router.url);

    // Check for logout flow
    this.route.queryParams.subscribe(params => {
      console.log('🔵 Query params:', params);
      if (params['logout'] === 'true') {
        this.isLoggingOut = true;
        this.isLoading = false;
        this.router.navigate(['/sso'], { queryParams: { logout: 'true' } });
        return;
      }
    });

    if (this.isLoggingOut) {
      console.log('🔴 Logout flow detected, exiting');
      return;
    }

    try {
      this.isLoading = true;

      console.log('🔵 Step 1: Initializing MSAL...');
      await this.msalService.instance.initialize();
      console.log('✅ MSAL initialized successfully');

      console.log('🔵 Step 2: Handling redirect promise...');
      const result = await this.msalService.instance.handleRedirectPromise();
      console.log('🔵 Redirect result:', result);

      if (result && result.account) {
        console.log('✅ Step 3: Login successful via redirect!');
        console.log('📧 User email:', result.account.username);
        console.log('🔑 Access token present:', !!result.accessToken);
        console.log('👤 Account:', result.account);

        // Set active account
        this.msalService.instance.setActiveAccount(result.account);

        // Store Microsoft token
        if (result.accessToken) {
          localStorage.setItem('loginToken', result.accessToken);
          console.log('✅ LoginToken stored in localStorage');
        }

        // Get user email
        this.usermail = result.account.username;

        console.log('🔵 Step 4: Calling backend with email:', this.usermail);
        this.ssoLoginToBackend(this.usermail);
        return;
      }

      console.log('⚠️ Step 3: No redirect result found');
      console.log('🔵 Step 4: Checking for existing active account...');

      const account = this.msalService.instance.getActiveAccount();
      console.log('🔵 Active account:', account);

      if (account) {
        console.log('✅ Found active account:', account.username);
        this.usermail = account.username;

        try {
          console.log('🔵 Step 5: Acquiring token silently...');
          const tokenResponse = await firstValueFrom(
            this.msalService.acquireTokenSilent({
              scopes: ['user.read'],
              account
            })
          );
          console.log('✅ Token acquired:', !!tokenResponse?.accessToken);

          if (tokenResponse?.accessToken) {
            localStorage.setItem('loginToken', tokenResponse.accessToken);
            console.log('🔵 Step 6: Calling backend with email:', this.usermail);
            this.ssoLoginToBackend(this.usermail);
          } else {
            console.warn('⚠️ No access token in response');
            this.redirectToSSO();
          }
        } catch (error) {
          console.error('❌ Token acquisition failed:', error);
          this.handleError('Failed to acquire authentication token. Please try again.');
          setTimeout(() => this.redirectToSSO(), 3000);
        }
      } else {
        console.warn('⚠️ No active account found');
        this.redirectToSSO();
      }
    } catch (error) {
      console.error('❌ Fatal error in ngOnInit:', error);
      this.handleError('Authentication failed. Please try again.');
      setTimeout(() => this.redirectToSSO(), 3000);
    }
  }

  ssoLoginToBackend(usermail: string) {
    console.log('🔵 ========================================');
    console.log('🔵 ssoLoginToBackend called');
    console.log('📧 Email:', usermail);
    console.log('🔵 ========================================');

    if (!usermail) {
      console.error('❌ User email is missing!');
      this.handleError('User email is missing');
      return;
    }

    this.isLoading = true;

    console.log('🔵 Making HTTP POST request to backend...');
    console.log('🌐 API URL:', this.authService['ssoUrl']);

    this.authService.ssoLogin(usermail).subscribe({
      next: (response) => {
        console.log('✅ ========================================');
        console.log('✅ Backend response received successfully!');
        console.log('✅ Response:', response);
        console.log('✅ Token present:', !!response?.token);
        console.log('✅ ========================================');

        this.isLoading = false;

        // Double-check navigation
        if (this.router.url !== '/home') {
          console.log('🔵 Manually navigating to /home');
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        console.error('❌ ========================================');
        console.error('❌ Backend error occurred!');
        console.error('❌ Error:', error);
        console.error('❌ Error type:', typeof error);
        console.error('❌ Error status:', error?.status);
        console.error('❌ Error message:', error?.message);
        console.error('❌ ========================================');

        this.handleError(error || 'Authentication failed. Please try again.');
        this.isLoading = false;
      }
    });
  }

  private redirectToSSO() {
    console.log('🔵 Redirecting to SSO page...');
    this.isLoading = false;
    localStorage.removeItem('loginToken');
    this.router.navigate(['/sso']);
  }

  private handleError(message: string) {
    console.error('❌ Handling error:', message);
    this.errorMessage = message;
    this.showError = true;
    this.isLoading = false;
  }

  ngOnDestroy() {
    console.log('🔵 AuthComponentSSO destroyed');
    this.isLoading = false;
  }
}

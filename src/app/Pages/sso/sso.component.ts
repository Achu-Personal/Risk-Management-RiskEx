import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import {
  AuthenticationResult,
  InteractionStatus,
  RedirectRequest
} from '@azure/msal-browser';
import { filter, Subject, take, takeUntil } from 'rxjs';
import {
  MSAL_GUARD_CONFIG,
  MsalBroadcastService,
  MsalGuardConfiguration,
  MsalService
} from '@azure/msal-angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-loginsso',
  standalone: true,
  imports: [],
  templateUrl: './sso.component.html',
  styleUrls: ['./sso.component.scss']
})
export class SsoComponent implements OnInit, OnDestroy {
  private readonly _destroying$ = new Subject<void>();
  private readonly defaultScopes = ['user.read'];
  loginDisplay = false;
  isIframe = false;
  isInitialized = false;
  isLoggingOut = false;
  private interactionInProgress = false;
  private loginAttempted = false;

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private router: Router,
    private route: ActivatedRoute,
    private msalBroadcastService: MsalBroadcastService,
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('🔵 SsoComponent - ngOnInit started');

    // Check if we're in a logout flow
    this.route.queryParams.subscribe(params => {
      if (params['logout'] === 'true') {
        console.log('🔵 Logout flow detected');
        this.isLoggingOut = true;
        this.performLogout();
        return;
      }
    });

    if (this.isLoggingOut) return;

    try {
      // Initialize MSAL instance first
      console.log('🔵 Initializing MSAL instance...');
      await this.msalService.instance.initialize();

      // Handle any pending redirect
      console.log('🔵 Handling redirect promise...');
      const redirectResult = await this.msalService.instance.handleRedirectPromise();

      if (redirectResult) {
        console.log('🔵 Redirect result found, redirecting to /auth');
        // If there's a redirect result, go to auth component
        this.router.navigate(['/auth']);
        return;
      }

      this.isInitialized = true;
      console.log('✅ MSAL instance initialized');
    } catch (error) {
      console.error('❌ MSAL initialization error:', error);
    }

    // Monitor interaction status with a slight delay to ensure proper initialization
    setTimeout(() => {
      this.msalBroadcastService.inProgress$
        .pipe(takeUntil(this._destroying$))
        .subscribe((status: InteractionStatus) => {
          console.log('🔵 MSAL Interaction Status:');

          const wasInProgress = this.interactionInProgress;
          this.interactionInProgress = status !== InteractionStatus.None;

          // Reset login attempted flag when interaction completes
          if (wasInProgress && !this.interactionInProgress) {
            console.log('✅ Interaction completed, resetting login flag');
            this.loginAttempted = false;
          }

          if (status === InteractionStatus.None) {
            this.setLoginDisplay();
            if (!this.isLoggingOut) {
              this.checkAndSetActiveAccount();
            }
          }
        });
    }, 100);

    this.isIframe = window !== window.parent && !window.opener;
    this.setLoginDisplay();
    this.msalService.instance.enableAccountStorageEvents();

    if (!this.isLoggingOut) {
      this.checkAndSetActiveAccount();
    }

    console.log('✅ SsoComponent initialization complete');
  }

  setLoginDisplay() {
    this.loginDisplay = this.msalService.instance.getAllAccounts().length > 0;
    console.log('🔵 Login display:', this.loginDisplay);
  }

  async loginRedirect() {
    console.log('🔵 loginRedirect called');
    console.log('🔵 Current interaction status:', this.interactionInProgress);
    console.log('🔵 Login attempted:', this.loginAttempted);

    // Check if MSAL is initialized
    if (!this.isInitialized) {
      console.error('❌ MSAL not initialized yet, initializing now...');
      try {
        await this.msalService.instance.initialize();
        this.isInitialized = true;
        console.log('✅ MSAL initialized');
      } catch (error) {
        console.error('❌ Failed to initialize MSAL:', error);
        return;
      }
    }

    // Force reset interaction status if it's stuck
    const actualStatus = this.msalService.instance.getActiveAccount();
    if (actualStatus) {
      console.log('⚠️ User already logged in, clearing and restarting...');
      this.interactionInProgress = false;
      this.loginAttempted = false;
    }

    // Check if login was already attempted
    if (this.loginAttempted) {
      console.log('⚠️ Login already attempted, forcing reset');
      this.loginAttempted = false;
    }

    // Skip interaction check - just try to login
    // The MSAL library will handle if there's actually an interaction in progress
    console.log('🔵 Bypassing interaction check and attempting login');

    try {
      // Mark login as attempted
      this.loginAttempted = true;
      console.log('🔵 Setting loginAttempted flag to true');

      const request: RedirectRequest = {
        scopes: this.defaultScopes,
        prompt: 'select_account',
      };

      console.log('🔵 Initiating MSAL redirect with request:', request);
      await this.msalService.loginRedirect(request);
      console.log('✅ MSAL redirect initiated - user will be redirected to Microsoft');
    } catch (error) {
      console.error('❌ Login redirect error:', error);
      // Reset the flag if there's an error
      this.loginAttempted = false;
      this.interactionInProgress = false;
    }
  }

  async logout() {
    console.log('🔵 logout called');

    if (this.isLoggingOut) {
      console.log('⚠️ Already logging out');
      return;
    }

    localStorage.removeItem('loginToken');
    localStorage.removeItem('token');
    localStorage.clear();

    this.isLoggingOut = true;

    this.performLogout();
  }

  async performLogout() {
    console.log('🔵 performLogout called');

    try {
      // Ensure MSAL is initialized
      if (!this.isInitialized) {
        await this.msalService.instance.initialize();
        this.isInitialized = true;
      }

      const accounts = this.msalService.instance.getAllAccounts();
      console.log('🔵 Accounts to logout:', accounts.length);

      if (accounts && accounts.length > 0) {
        this.msalService.instance.setActiveAccount(null);
      }

      this.msalService.logoutRedirect({
        postLogoutRedirectUri: window.location.origin + '/sso'
      });
    } catch (error) {
      console.error('❌ Error during MSAL logout:', error);
      window.location.href = '/sso';
    }
  }

  checkAndSetActiveAccount() {
    if (this.isLoggingOut || !this.isInitialized) return;

    const activeAccount = this.msalService.instance.getActiveAccount();
    console.log('🔵 Active account:', activeAccount?.username || 'None');

    if (!activeAccount && this.msalService.instance.getAllAccounts().length > 0) {
      const account = this.msalService.instance.getAllAccounts()[0];
      console.log('🔵 Setting active account:', account.username);
      this.msalService.instance.setActiveAccount(account);

      this.msalService.acquireTokenSilent({
        scopes: ["user.read"],
        account: account
      }).subscribe({
        next: (response: AuthenticationResult) => {
          if (response && response.accessToken) {
            localStorage.setItem('loginToken', response.accessToken);
            console.log('✅ Token acquired and stored');
          }
        },
        error: (error) => {
          console.error('❌ Silent token acquisition failed', error);
        }
      });
    }
  }

  ngOnDestroy(): void {
    console.log('🔵 SsoComponent destroyed');
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  loginRedirectToRiskex() {
    console.log('🔵 Redirecting to /login');
    this.router.navigate(['/login']);
  }
}

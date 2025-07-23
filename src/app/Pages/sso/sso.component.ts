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
  private interactionInProgress = false; // Track interaction state

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private router: Router,
    private route: ActivatedRoute,
    private msalBroadcastService: MsalBroadcastService,
  ) {}

  ngOnInit(): void {
    // Check if we're in a logout flow
    this.route.queryParams.subscribe(params => {
      if (params['logout'] === 'true') {
        this.isLoggingOut = true;
        this.performLogout();
        return;
      }
    });

    // Skip redirect handling if we're explicitly logging out
    if (this.isLoggingOut) return;

    // Monitor interaction status
    this.msalBroadcastService.inProgress$
      .pipe(takeUntil(this._destroying$))
      .subscribe((status: InteractionStatus) => {
        this.interactionInProgress = status !== InteractionStatus.None;
        if (status === InteractionStatus.None) {
          this.setLoginDisplay();
          // Only check for active account if we're not logging out
          if (!this.isLoggingOut) {
            this.checkAndSetActiveAccount();
          }
        }
      });

    this.msalService.handleRedirectObservable().subscribe({
      next: (response: AuthenticationResult) => {
        if (response && response.accessToken) {
          localStorage.setItem('loginToken', response.accessToken);
          this.router.navigate(['/auth']);
        }
      },
      error: (error) => console.error('Redirect handling error:', error)
    });

    this.isIframe = window !== window.parent && !window.opener;
    this.setLoginDisplay();
    this.msalService.instance.enableAccountStorageEvents();

    // Only check for active account if we're not logging out
    if (!this.isLoggingOut) {
      this.checkAndSetActiveAccount();
    }
  }

  setLoginDisplay() {
    this.loginDisplay = this.msalService.instance.getAllAccounts().length > 0;
  }

  async loginRedirect() {
    // Prevent multiple simultaneous login attempts
    if (this.interactionInProgress) {
      console.log('Interaction already in progress, skipping login attempt');
      return;
    }

    try {
      // Wait for any ongoing interaction to complete
      await this.waitForInteractionToComplete();

      const request: RedirectRequest = {
        ...this.msalGuardConfig.authRequest as RedirectRequest,
        scopes: this.defaultScopes,
        prompt: 'select_account'
      };

      this.msalService.loginRedirect(request);
    } catch (error) {
      console.error('Login redirect error:', error);
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

  async logout() {
    // Prevent multiple logout attempts
    if (this.isLoggingOut || this.interactionInProgress) {
      return;
    }

    // Clear local storage first
    localStorage.removeItem('loginToken');
    localStorage.removeItem('token');
    localStorage.clear();

    // Set logout flag
    this.isLoggingOut = true;

    // Wait for any ongoing interaction to complete
    await this.waitForInteractionToComplete();

    // Use MSAL logout
    this.performLogout();
  }

  performLogout() {
    // The correct way to clear accounts in MSAL
    try {
      // First try to get all accounts
      const accounts = this.msalService.instance.getAllAccounts();

      // If we have active accounts, clear the active account first
      if (accounts && accounts.length > 0) {
        this.msalService.instance.setActiveAccount(null);
      }

      // Logout with redirect
      this.msalService.logoutRedirect({
        postLogoutRedirectUri: window.location.origin + '/sso'
      });
    } catch (error) {
      console.error('Error during MSAL logout:', error);
      // Fallback to simple redirect
      window.location.href = '/sso';
    }
  }

  checkAndSetActiveAccount() {
    // Don't check active account during logout or if interaction is in progress
    if (this.isLoggingOut || this.interactionInProgress) return;

    const activeAccount = this.msalService.instance.getActiveAccount();
    if (!activeAccount && this.msalService.instance.getAllAccounts().length > 0) {
      const account = this.msalService.instance.getAllAccounts()[0];
      this.msalService.instance.setActiveAccount(account);

      this.msalService.acquireTokenSilent({
        scopes: ["user.read"],
        account: account
      }).subscribe({
        next: (response: AuthenticationResult) => {
          if (response && response.accessToken) {
            localStorage.setItem('loginToken', response.accessToken);
          }
        },
        error: (error) => {
          console.error('Silent token acquisition failed', error);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  loginRedirectToRiskex() {
    this.router.navigate(['/login']);
  }
}

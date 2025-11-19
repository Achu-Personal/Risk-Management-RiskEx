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

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private router: Router,
    private route: ActivatedRoute,
    private msalBroadcastService: MsalBroadcastService,
  ) {}

  ngOnInit(): void {
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

    // Monitor interaction status
    this.msalBroadcastService.inProgress$
      .pipe(takeUntil(this._destroying$))
      .subscribe((status: InteractionStatus) => {
        // console.log('🔵 MSAL Interaction Status:', InteractionStatus[status]);
        this.interactionInProgress = status !== InteractionStatus.None;
        if (status === InteractionStatus.None) {
          this.setLoginDisplay();
          if (!this.isLoggingOut) {
            this.checkAndSetActiveAccount();
          }
        }
      });

    // ✅ REMOVED: handleRedirectObservable() - let auth.component.ts handle it

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

    if (this.interactionInProgress) {
      console.log('⚠️ Interaction already in progress, skipping login attempt');
      return;
    }

    try {
      console.log('🔵 Waiting for interaction to complete...');
      await this.waitForInteractionToComplete();

      const request: RedirectRequest = {
        ...this.msalGuardConfig.authRequest as RedirectRequest,
        scopes: this.defaultScopes,
        prompt: 'select_account'
      };

      console.log('🔵 Initiating MSAL redirect with request:', request);
      this.msalService.loginRedirect(request);
      console.log('✅ MSAL redirect initiated - user will be redirected to Microsoft');
    } catch (error) {
      console.error('❌ Login redirect error:', error);
    }
  }

  private async waitForInteractionToComplete(): Promise<void> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.warn('⚠️ waitForInteractionToComplete timeout - forcing resolve');
        resolve();
      }, 3000);

      this.msalBroadcastService.inProgress$
        .pipe(
          filter((status: InteractionStatus) => status === InteractionStatus.None),
          take(1)
        )
        .subscribe(() => {
          console.log('✅ Interaction completed');
          clearTimeout(timeout);
          resolve();
        });
    });
  }

  async logout() {
    console.log('🔵 logout called');

    if (this.isLoggingOut || this.interactionInProgress) {
      console.log('⚠️ Already logging out or interaction in progress');
      return;
    }

    localStorage.removeItem('loginToken');
    localStorage.removeItem('token');
    localStorage.clear();

    this.isLoggingOut = true;

    await this.waitForInteractionToComplete();

    this.performLogout();
  }

  performLogout() {
    console.log('🔵 performLogout called');

    try {
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
    if (this.isLoggingOut || this.interactionInProgress) return;

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

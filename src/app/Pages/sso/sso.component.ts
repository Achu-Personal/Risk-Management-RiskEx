import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import {
  AuthenticationResult,
  InteractionStatus,
  BrowserAuthError,
  RedirectRequest
} from '@azure/msal-browser';
import { filter, Subject, takeUntil } from 'rxjs';
import {
  MSAL_GUARD_CONFIG,
  MsalBroadcastService,
  MsalGuardConfiguration,
  MsalService
} from '@azure/msal-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './sso.component.html',
  styleUrls: ['./sso.component.scss']
})
export class SsoComponent implements OnInit, OnDestroy {
  private readonly _destroying$ = new Subject<void>();
  private readonly defaultScopes = ['user.read']; // Define default scopes
  loginDisplay = false;
  isIframe = false;
  userEmail: string = '';
  isInitialized = false;

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private router: Router,
    private msalBroadcastService: MsalBroadcastService,
  ) {}

  async ngOnInit() {
    try {
      await this.msalService.initialize();
      this.isInitialized = true;
      await this.initializeAuth();
    } catch (error) {
      if (error instanceof BrowserAuthError) {
        console.error('MSAL Initialization Error:', error.errorMessage);
      } else {
        console.error('Unexpected error during initialization:', error);
      }
    }
  }

  private async initializeAuth() {
    if (!this.isInitialized) {
      console.error('MSAL not initialized');
      return;
    }

    try {
      const redirectResult = await this.msalService.handleRedirectObservable().toPromise();
      if (redirectResult) {
        console.log('Login successful');
        this.handleAuthenticationSuccess(redirectResult);
      }

      this.isIframe = window !== window.parent && !window.opener;
      this.setLoginDisplay();
      this.msalService.instance.enableAccountStorageEvents();

      this.msalBroadcastService.inProgress$
        .pipe(
          filter((status: InteractionStatus) => status === InteractionStatus.None),
          takeUntil(this._destroying$)
        )
        .subscribe(() => {
          this.setLoginDisplay();
          this.checkAndSetActiveAccount();
        });

      await this.checkAndSetActiveAccount();
    } catch (error) {
      console.error('Auth initialization error:', error);
    }
  }

  private handleAuthenticationSuccess(response: AuthenticationResult) {
    if (response.accessToken) {
      localStorage.setItem('loginToken', response.accessToken);
      this.userEmail = this.getEmailFromAccount(response.account);
    }
  }

  private getEmailFromAccount(account: any): string {
    return account?.username ||
           account?.idTokenClaims?.email ||
           account?.idTokenClaims?.preferred_username ||
           account?.userName ||
           '';
  }

  private async checkAndSetActiveAccount() {
    if (!this.isInitialized) {
      console.error('Cannot check account - MSAL not initialized');
      return;
    }

    const activeAccount = this.msalService.instance.getActiveAccount();
    if (!activeAccount && this.msalService.instance.getAllAccounts().length > 0) {
      const account = this.msalService.instance.getAllAccounts()[0];
      this.msalService.instance.setActiveAccount(account);
      this.userEmail = this.getEmailFromAccount(account);

      try {
        const response = await this.msalService.acquireTokenSilent({
          scopes: this.defaultScopes,
          account: account
        }).toPromise();

        if (response) {
          this.handleAuthenticationSuccess(response);
        }
      } catch (error) {
        console.error('Silent token acquisition failed:', error);
      }
    }
  }

  setLoginDisplay() {
    if (this.isInitialized) {
      this.loginDisplay = this.msalService.instance.getAllAccounts().length > 0;
    }
  }

  async loginRedirect() {
    if (!this.isInitialized) {
      console.error('Cannot login - MSAL not initialized');
      return;
    }

    try {
      const request: RedirectRequest = {
        scopes: this.defaultScopes,
        ...(this.msalGuardConfig.authRequest || {})
      };
      await this.msalService.loginRedirect(request);
    } catch (error) {
      console.error('Login redirect failed:', error);
    }
  }

  async logout() {
    if (!this.isInitialized) {
      console.error('Cannot logout - MSAL not initialized');
      return;
    }

    try {
      await this.msalService.logoutRedirect();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}

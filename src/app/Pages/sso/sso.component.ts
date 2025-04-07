
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import {
  AuthenticationResult,
  InteractionStatus,
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

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private router: Router,
    private msalBroadcastService: MsalBroadcastService,
  ) {}

  ngOnInit(): void {
    this.msalService.handleRedirectObservable().subscribe({
      next: (response: AuthenticationResult) => {
        if (response && response.accessToken) {
          // console.log('Login successful', response);
          localStorage.setItem('loginToken', response.accessToken);
          this.router.navigate(['/auth']);
        }
      },
      error: (error) => console.error('Redirect handling error:', error)
    });

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
        this.checkAndSetActiveAccount();

  }

  setLoginDisplay() {
    this.loginDisplay = this.msalService.instance.getAllAccounts().length > 0;
  }

  loginRedirect() {
    const request: RedirectRequest = {
      ...this.msalGuardConfig.authRequest as RedirectRequest,
      scopes: this.defaultScopes,
      prompt: 'select_account'
    };

    this.msalService.loginRedirect(request);
  }

  logout() {
    localStorage.removeItem('loginToken');
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: window.location.origin
    });
  }

checkAndSetActiveAccount() {
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
  loginRedirectToRiskex(){
    this.router.navigate(['/login']);
  }
}

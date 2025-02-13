
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationResult, InteractionStatus,  } from '@azure/msal-browser';
import { filter, Subject, takeUntil } from 'rxjs';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './sso.component.html',
  styleUrls: ['./sso.component.scss']
})
export class SsoComponent implements OnInit, OnDestroy {
  private readonly _destroying$ = new Subject<void>();
  loginDisplay = false;
  isIframe = false;


  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private router: Router,
    private msalBroadcastService: MsalBroadcastService,

  ) {}

  async ngOnInit() {
   await  this.authService.instance.initialize();
   this.authService.handleRedirectObservable().subscribe((response: AuthenticationResult) => {
    if (response && response.accessToken) {
      console.log('Login successful', response);
      localStorage.setItem('loginToken', response.accessToken);
      // this.router.navigate(['/auth']);
    }
  });

  this.isIframe = window !== window.parent && !window.opener;

  this.setLoginDisplay();
  this.authService.instance.enableAccountStorageEvents();

  this.msalBroadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.setLoginDisplay();
      this.checkAndSetActiveAccount();
    });

  // Check for active account and store token
  this.checkAndSetActiveAccount();
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }
  checkAndSetActiveAccount() {
    const activeAccount = this.authService.instance.getActiveAccount();
    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      const account = this.authService.instance.getAllAccounts()[0];
      this.authService.instance.setActiveAccount(account);

      // Acquire token silently
      this.authService.acquireTokenSilent({
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

  loginRedirect() {
    this.authService.loginRedirect(this.msalGuardConfig.authRequest as any);
    console.log('Login successful');
    // localStorage.setItem('loginToken', response.accessToken);
  }

  logout() {
    this.authService.logoutRedirect();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}


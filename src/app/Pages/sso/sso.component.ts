
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
  userEmail: string = '';


  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private router: Router,
    private msalBroadcastService: MsalBroadcastService,

  ) {}

  // async ngOnInit() {
  //  await  this.msalService.instance.initialize();
  //  this.msalService.handleRedirectObservable().subscribe((response: AuthenticationResult) => {
  //   if (response && response.accessToken) {
  //     console.log('Login successful', response);
  //     localStorage.setItem('loginToken', response.accessToken);
  //     // this.router.navigate(['/auth']);
  //   }
  // });

  // this.isIframe = window !== window.parent && !window.opener;

  // this.setLoginDisplay();
  // this.msalService.instance.enableAccountStorageEvents();

  // this.msalBroadcastService.inProgress$
  //   .pipe(
  //     filter((status: InteractionStatus) => status === InteractionStatus.None),
  //     takeUntil(this._destroying$)
  //   )
  //   .subscribe(() => {
  //     this.setLoginDisplay();
  //     this.checkAndSetActiveAccount();
  //   });

  // // Check for active account and store token
  // this.checkAndSetActiveAccount();
  // }

  // setLoginDisplay() {
  //   this.loginDisplay = this.msalService.instance.getAllAccounts().length > 0;
  // }
  // checkAndSetActiveAccount() {
  //   const activeAccount = this.msalService.instance.getActiveAccount();
  //   if (!activeAccount && this.msalService.instance.getAllAccounts().length > 0) {
  //     const account = this.msalService.instance.getAllAccounts()[0];
  //     this.msalService.instance.setActiveAccount(account);

  //     // Acquire token silently
  //     this.msalService.acquireTokenSilent({
  //       scopes: ["user.read"],
  //       account: account
  //     }).subscribe({
  //       next: (response: AuthenticationResult) => {
  //         if (response && response.accessToken) {
  //           localStorage.setItem('loginToken', response.accessToken);
  //         }
  //       },
  //       error: (error) => {
  //         console.error('Silent token acquisition failed', error);
  //       }
  //     });
  //   }
  // }

  // loginRedirect() {
  //   this.msalService.loginRedirect(this.msalGuardConfig.authRequest as any);
  //   console.log('Login successful');
  //   // localStorage.setItem('loginToken', response.accessToken);
  // }

  // logout() {
  //   this.msalService.logoutRedirect();
  // }

  // ngOnDestroy(): void {
  //   this._destroying$.next(undefined);
  //   this._destroying$.complete();
  // }
  async ngOnInit() {
    try {
      // Wait for MSAL to initialize
      await this.msalService.instance.initialize();

      this.msalService.handleRedirectObservable().subscribe((response: AuthenticationResult) => {
        if (response && response.accessToken) {
          console.log('Login successful', response);
          localStorage.setItem('loginToken', response.accessToken);
          this.userEmail = this.getEmailFromAccount(response.account);
        }
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
    } catch (error) {
      console.error('MSAL Initialization Error:', error);
    }
  }


  private getEmailFromAccount(account: any): string {
    // Try different possible locations for the email
    return account.username || // Primary email/UPN
           account.idTokenClaims?.email || // Email from ID token claims
           account.idTokenClaims?.preferred_username || // Preferred username
           account.userName || // Fallback to username
           ''; // Empty string if no email found
  }

  checkAndSetActiveAccount() {
    const activeAccount = this.msalService.instance.getActiveAccount();
    if (!activeAccount && this.msalService.instance.getAllAccounts().length > 0) {
      const account = this.msalService.instance.getAllAccounts()[0];
      this.msalService.instance.setActiveAccount(account);

      // Get email from active account
      this.userEmail = this.getEmailFromAccount(account);
      console.log('Active account email:', this.userEmail);

      this.msalService.acquireTokenSilent({
        scopes: ["user.read"],
        account: account
      }).subscribe({
        next: (response: AuthenticationResult) => {
          if (response && response.accessToken) {
            localStorage.setItem('loginToken', response.accessToken);

            // Update email if not already set
            if (!this.userEmail && response.account) {
              this.userEmail = this.getEmailFromAccount(response.account);
              console.log('Updated user email:', this.userEmail);
            }
          }
        },
        error: (error) => {
          console.error('Silent token acquisition failed', error);
        }
      });
    }
  }

  setLoginDisplay() {
    this.loginDisplay = this.msalService.instance.getAllAccounts().length > 0;
  }

  loginRedirect() {
    this.msalService.loginRedirect(this.msalGuardConfig.authRequest as any);
  }

  logout() {
    this.msalService.logoutRedirect();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}



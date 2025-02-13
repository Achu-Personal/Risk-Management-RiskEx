import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  userRoleData: any;
  isLoading = true;

  // constructor(private authService: AuthService, private route: Router) {
  //   this.initializeUserRoleAndRoute();
  // }

  // async initializeUserRoleAndRoute(): Promise<void> {
  //   try {
  //     this.userRoleData = await this.getUserRole();
  //     localStorage.setItem("userDetails", JSON.stringify(this.userRoleData.result));
  //     localStorage.setItem("apiToken", this.userRoleData.result.Token);

  //     setTimeout(() => {

  //       if (this.userRoleData==="DepartmentUser") {
  //         this.route.navigate(['/home']);
  //       }
  //     }, 1000);
  //   } catch (error) {
  //     console.error('Error fetching user role data:', error);
  //   }
  // }

  // getUserRole(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.authService.getUserRole();
  //   });
  // }

  constructor(
    private authService: AuthService,
    private router: Router,
    private msalService: MsalService // MSAL for handling authentication
  ) {}

  async ngOnInit(): Promise<void> {
    await this.ssoLogin(); // Perform SSO login when the component loads
  }

  async ssoLogin(): Promise<void> {
    try {
      const account = this.msalService.instance.getActiveAccount();
      if (!account) {
        console.log('No active session. Redirecting to login...');
        this.msalService.loginRedirect();
        return;
      }

      // ✅ Use `.toPromise()` and check for `undefined`
      const response = await this.msalService.acquireTokenSilent({
        scopes: ['user.read'],
        account
      }).toPromise();

      if (!response || !response.accessToken) {
        console.error('SSO Login Failed: No token received');
        return;
      }

      console.log('SSO Login Successful!', response);
      localStorage.setItem('loginToken', response.accessToken);

      // ✅ Send token to backend for authentication
      await this.initializeUserRoleAndRoute(response.accessToken);
    } catch (error) {
      console.error('SSO Login Error:', error);
      this.msalService.loginRedirect();
    }
  }

  async initializeUserRoleAndRoute(token: string): Promise<void> {
    try {
      this.userRoleData = await this.authService.getUserRole(); // Pass token to backend
      localStorage.setItem('userDetails', JSON.stringify(this.userRoleData.result));
      localStorage.setItem('apiToken', this.userRoleData.result.Token);

      setTimeout(() => {
        if (this.userRoleData.result.role === 'DepartmentUser') {
          this.router.navigate(['/home']);
        }
      }, 1000);
    } catch (error) {
      console.error('Error fetching user role data:', error);
    }
  }
}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import * as AOS from 'aos';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'RiskManagement';
  constructor(private authService: MsalService) {}
  ngOnInit() {
    AOS.init();

    this.authService.instance.handleRedirectPromise().then((result: AuthenticationResult | null) => {
      if (result) {
        this.authService.instance.setActiveAccount(result.account);
      } else {
        // ✅ Check if user is already logged in
        const accounts = this.authService.instance.getAllAccounts();
        if (accounts.length > 0) {
          this.authService.instance.setActiveAccount(accounts[0]);
        }
      }
    });
  }


}

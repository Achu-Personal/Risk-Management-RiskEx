import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';

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

  constructor(private authService: AuthService, private route: Router) {
    this.initializeUserRoleAndRoute();
  }

  async initializeUserRoleAndRoute(): Promise<void> {
    try {
      this.userRoleData = await this.getUserRole();
      localStorage.setItem("userDetails", JSON.stringify(this.userRoleData.result));
      localStorage.setItem("apiToken", this.userRoleData.result.Token);

      setTimeout(() => {

        if (this.userRoleData==="DepartmentUser") {
          this.route.navigate(['/home']);
        }
      }, 1000);
    } catch (error) {
      console.error('Error fetching user role data:', error);
    }
  }

  getUserRole(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authService.getUserRole();
    });
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../Services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const role = this.authService.getUserRole();
    const department = this.authService.getDepartmentName();

    if (role === 'ProjectUsers') {
      this.router.navigate(['/home']);
      return false;
    } else if (role === 'DepartmentUser') {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}

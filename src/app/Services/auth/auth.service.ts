import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../../../enviroments/environment';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  // private baseUrl = 'https://risk-management-riskex-backend-2.onrender.com/api/AuthControllers';
  private baseUrl = `${environment.apiUrl}/AuthControllers`;
  private apiUrl = `${this.baseUrl}/Login`;
  private ssoUrl = `${this.baseUrl}/ssologin`;
  private userRole = new BehaviorSubject<string | null>(null);
  private departmentName = new BehaviorSubject<string | null>(null);
  private departmentId = new BehaviorSubject<string | null>(null);
  private projects = new BehaviorSubject<any[]>([]);
  private currentUserId = new BehaviorSubject<string | null>(null);
  private userMail = new BehaviorSubject<string | null>(null);
  private userName = new BehaviorSubject<string | null>(null);



  constructor(private http: HttpClient, private router: Router, private msalService: MsalService) {
    this.loadUserDataFromToken();
  }

  private loadUserDataFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.setUserDetails(token);
    }
  }


  ssoLogin(usermail: string): Observable<any> {
    const payload = { email: usermail };

    // console.log('🔵 AuthService.ssoLogin called');
    // console.log('📧 Email:', usermail);
    // console.log('🌐 URL:', this.ssoUrl);
    // console.log('📦 Payload:', payload);

    return this.http.post(this.ssoUrl, payload).pipe(
      tap((response: any) => {
        // console.log('✅ Backend response received:', response);

        if (response.token) {
          // console.log('✅ Token received, storing...');
          localStorage.setItem('token', response.token);

          // console.log('✅ Setting user details...');
          this.setUserDetails(response.token);

          // console.log('✅ Navigating to dashboard...');
          this.navigateToDashboard();
        } else {
          // console.warn('⚠️ No token in response');
        }
      }),
      catchError((error: any) => {
        console.error('❌ Backend error in service:', error);
        console.error('❌ Error status:', error.status);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error body:', error.error);

        let errorMessage = 'An unexpected error occurred';

        if (error.status === 400) {
          errorMessage = 'You do not have access to the system. Please contact the administrator.';
        } else if (error.status === 401) {
          errorMessage = 'Your account has been deactivated. Please contact the admin.';
        } else if (error.error && typeof error.error === 'object' && 'message' in error.error) {
          errorMessage = error.error.message || errorMessage;
        }

        console.error('❌ Final error message:', errorMessage);
        return throwError(() => errorMessage);
      })
    );
  }


  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.setUserDetails(response.token);
          this.navigateToDashboard();
        }
      }),
      catchError((error: any) => {
        let errorMessage = 'An unexpected error occurred';

        if (error.status === 400) {
          errorMessage = 'Invalid Usermail or Password';
        } else if (error.status === 401) {
          errorMessage = 'Your account has been deactivated. Please contact the admin.';
        } else if (error.error && typeof error.error === 'object' && 'message' in error.error) {
          errorMessage = error.error.message || errorMessage;
        }

        return throwError(() => errorMessage);
      })
    );
  }

  setUserDetails(token: string) {
    const decodedToken = this.jwtHelper.decodeToken(token);
    this.userRole.next(decodedToken.role);
    this.departmentName.next(decodedToken.DepartmentName);
    this.departmentId.next(decodedToken.DepartmentId);
    this.currentUserId.next(decodedToken.CurrentUserId);
    this.userMail.next(decodedToken.UserMail);
    this.userName.next(decodedToken.UserName);
    this.projects.next(decodedToken.Projects);


    if (decodedToken.Projects) {
      try {
        const projectsData = JSON.parse(decodedToken.Projects);
        this.projects.next(projectsData);
      } catch (error) {
        console.error('Error parsing projects data:', error);
        this.projects.next([]);
      }
    }
  }


  getUserRole() {
    return this.userRole.value;
  }
  getUserName() {
    return this.userName.value;
  }
  getUserMail() {
    return this.userMail.value;

  }

  getDepartmentName() {
    return this.departmentName.value;
  }

  getDepartmentId() {
    return this.departmentId.value;
  }

  getCurrentUserId() {
    return this.currentUserId.value;
  }

  getProjects() {
    return this.projects.value;

  }
  getProjectsFor(): Observable<any[]> {
    const value: any[] = this.projects.value;
    console.log(value);

    return of(value).pipe(
      map((projects) =>
        projects.map((project) => {
          return Object.keys(project).reduce((acc, key) => {
            acc[key.toLowerCase()] = project[key];
            return acc;
          }, {} as any);
        })
      )
    );
  }

  // Observable getters for reactive updates
  getUserRole$() {
    return this.userRole.asObservable();
  }

  getDepartmentName$() {
    return this.departmentName.asObservable();
  }

  getDepartmentId$() {
    return this.departmentId.asObservable();
  }

  getCurrentUserId$() {
    return this.currentUserId.asObservable();
  }

  isLoggedIn() {
    const token = localStorage.getItem('token');
    return token && !this.jwtHelper.isTokenExpired(token);
  }


  // async logout() {
  //   try {
  //     localStorage.clear();

  //     this.userRole.next(null);
  //     this.departmentName.next(null);
  //     this.departmentId.next(null);
  //     this.projects.next([]);
  //     this.currentUserId.next(null);


  //     await this.msalService.logoutRedirect({
  //       postLogoutRedirectUri: window.location.origin + '/sso'
  //     });

  //   } catch (error) {
  //     console.error('Logout error:', error);
  //     this.router.navigate(['/sso']);
  //   }
  // }

  logout() {
    localStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('loginToken');

    this.userRole.next(null);
    this.departmentName.next(null);
    this.departmentId.next(null);
    this.projects.next([]);
    this.currentUserId.next(null);

    // Handle MSAL logout if available
    try {
      // Use a type assertion for the window object
      const msalInstance = (window as any).msal || this.msalService?.instance;
      if (msalInstance) {
        window.location.href = '/sso';
      } else {
        this.router.navigate(['/sso']);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      this.router.navigate(['/sso']);
    }
  }

  private navigateToDashboard() {
    this.router.navigate(['/home']);
  }

  getToken() {
    const token = localStorage.getItem('token');
    return token;
  }
}

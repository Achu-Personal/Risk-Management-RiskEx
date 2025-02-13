import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private apiUrl = 'https://localhost:7216/api/AuthControllers/SSOlogin';
  private userRole = new BehaviorSubject<string | null>(null);
  private departmentName = new BehaviorSubject<string | null>(null);
  private departmentId = new BehaviorSubject<string | null>(null);
  private projects = new BehaviorSubject<any[]>([]);
  private currentUserId = new BehaviorSubject<string | null>(null);
  private userMail = new BehaviorSubject<string | null>(null);
  private userName = new BehaviorSubject<string | null>(null);



  constructor(private http: HttpClient, private router: Router) {
    this.loadUserDataFromToken();
  }

  private loadUserDataFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.setUserDetails(token);
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.setUserDetails(response.token);
        console.log("userrole", this.userRole.value);
        this.navigateToDashboard();
      }),
      catchError((error) => {
        return throwError(() => error.error.message || "An unexpected error occurred.");
      })
    );
  }

   /**
   * ✅ New SSO Login Method
   */
   ssoLogin(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { token }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.setUserDetails(response.token);
        console.log("User Role:", this.userRole.value);
        this.navigateToDashboard();
      }),
      catchError((error) => {
        return throwError(() => error.error.message || "An unexpected error occurred.");
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
  getUserName(){
    return this.userName.value;
  }
  getUserMail(){
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

  logout() {
    localStorage.removeItem('token');
    this.userRole.next(null);
    this.departmentName.next(null);
    this.departmentId.next(null);
    this.projects.next([]);
    this.currentUserId.next(null);
    this.router.navigate(['/sso']);
  }

  private navigateToDashboard() {
     this.router.navigate(['/home']);
  }

  getToken()
  {
    const token = localStorage.getItem('token');
    return token;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { project } from '../Interfaces/projects.interface';

// interface Project {
//   id: string;
//   name: string;
// }

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private apiUrl = 'https://localhost:7216/api/AuthControllers/Login';
  private userRole = new BehaviorSubject<string | null>(null);
  private departmentName = new BehaviorSubject<string | null>(null);
  private departmentId = new BehaviorSubject<string | null>(null);
  private projects = new BehaviorSubject<project[]>([]);
  private currentUserId = new BehaviorSubject<string | null>(null);
  private userMail = new BehaviorSubject<string | null>(null);
  private userName = new BehaviorSubject<string | null>(null);



  constructor(private http: HttpClient, private router: Router) {
    // Initialize values from token if exists
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

  setUserDetails(token: string) {
    const decodedToken = this.jwtHelper.decodeToken(token);
    this.userRole.next(decodedToken.role);
    this.departmentName.next(decodedToken.DepartmentName);
    this.departmentId.next(decodedToken.DepartmentId);
    this.currentUserId.next(decodedToken.CurrentUserId);
    this.userMail.next(decodedToken.UserMail);
    this.userName.next(decodedToken.UserName);


    // Parse projects from the token if they exist
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

  // Getters for all user data
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
    return this.projects.asObservable();
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
    this.router.navigate(['/auth']);
  }

  private navigateToDashboard() {
     // const role = this.userRole.value;
     this.router.navigate(['/home']);
    // const role = this.userRole.value;
    // if (role === 'ProjectUsers') {
    //   this.router.navigate(['/home']);
    // } else if (role === 'DepartmentUser') {
    //   this.router.navigate(['/home']);
    // } else {
    //   this.router.navigate(['/home']);
    // }
  }

  getToken()
  {
    const token = localStorage.getItem('token');


    return token;
  }
}

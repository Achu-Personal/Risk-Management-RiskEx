import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { AuthService } from '../../Services/auth/auth.service';
import { Router } from '@angular/router';
import { StyleButtonComponent } from '../style-button/style-button.component';
import { ChangepasswordComponent } from '../../Components/changepassword/changepassword.component';

@Component({
  selector: 'app-usericon-dropdown',
  standalone: true,
  imports: [NgIf, CommonModule, StyleButtonComponent, ChangepasswordComponent],
  templateUrl: './usericon-dropdown.component.html',
  styleUrl: './usericon-dropdown.component.scss',
})
export class UsericonDropdownComponent {
  constructor(public auth: AuthService, private router: Router) {}

  changePasswordVisible: boolean = false;

  dropdownVisible: boolean = false;
  user = {
    image:
      'https://w7.pngwing.com/pngs/152/155/png-transparent-male-man-person-business-avatar-icon.png',
    name: 'SreeHari',
    username: 'Sreehari',
    role: 'Admin',
    department: 'Audits And Compilance',
    email: 'sreehariace@gmail.com',
  };

  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }
  logout() {
    this.auth.logout();
  }

  navigateToChangePassword() {
    this.router.navigate(['/changepassword']);
  }

  @Output() changePasswordClicked = new EventEmitter<void>();

  onChangePassword(): void {
    this.changePasswordVisible = true;
    this.changePasswordClicked.emit();
  }
  closeChangePassword(): void {
    this.changePasswordVisible = false;
  }

  @HostListener('document:click')
  closeDropdown(): void {
    this.dropdownVisible = false;
  }
  getPrimaryRole(): string | null {
    const roles = this.auth.getUserRole();
    if (Array.isArray(roles) && roles.length > 1) {
      return roles[1];
    }
    return roles;
  }

  formatRoleName(role: string | null): string {
    if (!role) return '';

    let formattedRole = role.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');

    formattedRole = formattedRole.replace(/([a-z])([A-Z])/g, '$1 $2');

    formattedRole = formattedRole.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');

    return formattedRole
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  themes = ['#4D4D4D'];
  activeTheme: string | null = null;
  activeIcon: string | null = null;

  setActiveTheme(theme: string) {
    this.activeTheme = theme;
    localStorage.setItem('activeTheme', theme);
  }

  setActiveIcon(icon: string) {
    this.activeIcon = this.activeIcon === icon ? null : icon;
  }
  ngOnInit() {
    const savedTheme = localStorage.getItem('activeTheme');
    if (savedTheme) {
      this.activeTheme = savedTheme;
    }
  }
  isAdminUser(): boolean {
    const role = this.getPrimaryRole();
    return role === 'Admin' || role === 'admin';
  }
}

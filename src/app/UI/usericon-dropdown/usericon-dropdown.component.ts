import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { AuthService } from '../../Services/auth/auth.service';
import { Router } from '@angular/router';
import { StyleButtonComponent } from "../style-button/style-button.component";

@Component({
  selector: 'app-usericon-dropdown',
  standalone: true,
  imports: [NgIf, CommonModule, StyleButtonComponent],
  templateUrl: './usericon-dropdown.component.html',
  styleUrl: './usericon-dropdown.component.scss'
})
export class UsericonDropdownComponent {
  constructor(public auth:AuthService , private router: Router){}



  dropdownVisible: boolean = false;
  user = {
    image: 'https://w7.pngwing.com/pngs/152/155/png-transparent-male-man-person-business-avatar-icon.png',
    name: 'SreeHari',
    username: 'Sreehari',
    role: 'Admin',
    department: 'Audits And Compilance',
    email: 'sreehariace@gmail.com'
  };

  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }
  logout(){
    this.auth.logout();
  }

  navigateToChangePassword() {
    this.router.navigate(['/changepassword']);

  }



  @Output() changePasswordClicked = new EventEmitter<void>();


  onChangePassword(): void {
    this.changePasswordClicked.emit();

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

  return formattedRole.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}
themes = ['#4D4D4D']; // Example themes
activeTheme: string | null = null;
activeIcon: string | null = null; // Tracks active icon

setActiveTheme(theme: string) {
  this.activeTheme = theme;
  localStorage.setItem('activeTheme', theme);
}

setActiveIcon(icon: string) {
  // If the same icon is clicked, deactivate it; otherwise, set it as active
  this.activeIcon = this.activeIcon === icon ? null : icon;
}
ngOnInit() {
  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem('activeTheme');
  if (savedTheme) {
    this.activeTheme = savedTheme;
  }
}
}


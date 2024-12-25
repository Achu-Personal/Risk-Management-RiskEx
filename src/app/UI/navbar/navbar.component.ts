import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input() data: any ={};

  showDropdown: boolean = false; // State to toggle dropdown visibility

  // Toggles dropdown menu
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  onChangePassword() {
    alert('Change Password Clicked');
  }

  // Handles 'Log Out' action
  onLogout() {
    alert('Log Out Clicked');
  }
}

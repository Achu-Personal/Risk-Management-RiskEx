import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-usericon-dropdown',
  standalone: true,
  imports: [NgIf],
  templateUrl: './usericon-dropdown.component.html',
  styleUrl: './usericon-dropdown.component.scss'
})
export class UsericonDropdownComponent {
  constructor(public auth:AuthService){}
  dropdownVisible: boolean = false;
  user = {
    image: 'https://w7.pngwing.com/pngs/152/155/png-transparent-male-man-person-business-avatar-icon.png', // Replace with actual user image URL
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
}

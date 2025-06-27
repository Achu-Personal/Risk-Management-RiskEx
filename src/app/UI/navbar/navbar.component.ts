import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input() data: any = {};

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((routeData: any) => {
      this.data.title = routeData.title;
    });
  }

  showDropdown: boolean = false;

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

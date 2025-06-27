import { Component, EventEmitter, Output } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { UsericonDropdownComponent } from "../../UI/usericon-dropdown/usericon-dropdown.component";
import { AuthService } from '../../Services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, UsericonDropdownComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Output() changePasswordRequested = new EventEmitter<void>();

  onPasswordChangeRequest(): void {
    this.changePasswordRequested.emit(); // Emit the event to DashboardComponent
  }

  showThemeOverlay=false;

  isShowPopUp:boolean=false
  showChangePassword(): void {
    this.isShowPopUp = true; // Show the change password component
  }

  hideChangePassword(): void {
    this.isShowPopUp = false; // Hide the change password component
  }




  menuItems = [
    { id: 1, label: 'Dashboard', icon: 'fa-solid fa-house', route: '/home', active: false },
    { id: 2, label: "Assignments", icon: "fa-solid fa-tasks", route: "/assignments",active: false},
    { id: 3, label: 'Approvals', icon: ' fa-solid fa-clipboard-check', route: '/approvals', active: false },
    { id: 4, label: 'Reports', icon: 'fa-solid fa-chart-simple', route: '/reports', active: false },
    { id: 5, label: 'Draft', icon: 'fa-brands fa-firstdraft', route: '/drafts', active: false },
    { id: 6, label: 'History', icon: 'fa-solid fa-clock', route: '/history', active: false },
    { id: 7, label: 'User Mangement', icon: 'fa-solid fa-users', route: '/users', active: false },
    { id: 8, label: 'Reference', icon: 'fa-solid fa-book', route: '/reference', active: false }

  ];

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {

    const role = this.auth.getUserRole();
    const roles = Array.isArray(role) ? role : [role];

    const isEmtUser = roles.includes('EMTUser');

    if (isEmtUser) {
      // Remove the Draft menu item (id = 5)
      this.menuItems = this.menuItems.filter(item => item.id !== 5);
    }

    this.setActiveFromRoute(this.router.url);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActiveFromRoute(event.urlAfterRedirects);
      }
    });
  }

  setActiveItem(selectedItem: any) {
    this.menuItems.forEach((item) => (item.active = false));
    selectedItem.active = true;
    this.router.navigate([selectedItem.route]);
  }
  removeAllOtherSelection()
  {
    this.menuItems.forEach((item) => (item.active = false));
  }

  setActiveFromRoute(currentRoute: string) {
    this.menuItems.forEach((item) => {
      item.active = item.route === currentRoute;
    });
  }

  setTheme(theme:any) {
    document.body.className = theme; // Apply the theme class to <body>
  }

  onMouseClick()
  {

      if(this.showThemeOverlay)
      document.getElementById("header-options-overlay")!.style.display="block"
      else
      document.getElementById("header-options-overlay")!.style.display="none"
      this.showThemeOverlay=!this.showThemeOverlay



  }

}

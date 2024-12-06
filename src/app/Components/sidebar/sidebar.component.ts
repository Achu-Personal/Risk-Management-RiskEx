import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  menuItems = [
    { id:1, label: 'Home', icon: 'bi-house', route: '/', active: true },
    { id:2, label: 'Users', icon: 'bi-people', route: '/users', active: false },
    { id:3, label: 'History', icon: 'bi-clock-history', route: '/history', active: false },
    { id:4, label: 'Reports', icon: 'bi-bar-chart', route: '/reports', active: false },
    { id:5,label: 'Approvals', icon: 'bi-check2-square', route: '/approvals', active: false },
  ];
  setActiveItem(selectedItem: any) {
    this.menuItems.forEach((item) => (item.active = false));
    selectedItem.active = true;
  }
}

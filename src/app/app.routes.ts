import { Routes } from '@angular/router';
import { DashboardComponent } from './Layout/dashboard/dashboard.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { UsersComponent } from './Pages/users/users.component';

export const routes: Routes = [
  {
    path:'',component:DashboardComponent
  },
  {path:'sidebar',component:SidebarComponent},
  {
    path:'user',component:UsersComponent
  }
];

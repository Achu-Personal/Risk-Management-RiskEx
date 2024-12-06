import { Routes } from '@angular/router';
import { DashboardComponent } from './Layout/dashboard/dashboard.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { UsersComponent } from './Pages/users/users.component';
import { ForgetpswrdComponent } from './Pages/forgetpswrd/forgetpswrd.component';
import { LoginComponent } from './Pages/login/login.component';

export const routes: Routes = [
  {
    path:'',component:DashboardComponent
  },
  {path:'sidebar',component:SidebarComponent},
  {
    path:'user',component:UsersComponent
  },
  {
    path:"forgetpassword",component:ForgetpswrdComponent
  },
  {
    path:"Login",component:LoginComponent
  }
];

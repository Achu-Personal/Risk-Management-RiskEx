import { Routes } from '@angular/router';
import { DashboardComponent } from './Layout/dashboard/dashboard.component';
import { ForgetpswrdComponent } from './Pages/forgetpswrd/forgetpswrd.component';
import { LoginComponent } from './Pages/login/login.component';

export const routes: Routes = [
  {
    path:'',component:DashboardComponent
  },
  {
    path:"forgetpassword",component:ForgetpswrdComponent
  },
  {
    path:"Login",component:LoginComponent
  }
];

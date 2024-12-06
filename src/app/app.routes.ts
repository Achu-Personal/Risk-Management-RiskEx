import { Routes } from '@angular/router';
import { DashboardComponent } from './Layout/dashboard/dashboard.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { RegisterRiskComponent } from './Pages/register-risk/register-risk.component';

export const routes: Routes = [
  {
    path:'',component:DashboardComponent
  },
  {path:'sidebar',component:SidebarComponent},

];

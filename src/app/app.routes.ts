import { Routes } from '@angular/router';
import { DashboardComponent } from './Layout/dashboard/dashboard.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { AuthComponent } from './Layout/auth/auth.component';
import { LoginComponent } from './Pages/login/login.component';
import { UsersComponent } from './Pages/users/users.component';
import { HistoryComponent } from './Pages/history/history.component';
import { ReportsComponent } from './Pages/reports/reports.component';
import { ApprovalComponent } from './Pages/approval/approval.component';
import { WildComponentComponent } from './Pages/wild-component/wild-component.component';
import { RegisterRiskComponent } from './Pages/register-risk/register-risk.component';

export const routes: Routes = [
  {
    path:'auth',component:AuthComponent,
    children:[
      {
        path:'login',component:LoginComponent
      }
    ]
  },
  {
    path:'',component:DashboardComponent,
    children:[
      {
        path:'home',component:DashboardComponent
      },
      // {path:"ViewRisk/:id",component:ViewRiskComponent}
      {
        path:'addrisk',component:RegisterRiskComponent
      },
      {
        path:'users',component:UsersComponent
      },
      {
        path:'history',component:HistoryComponent
      },
      {
        path:'reports',component:ReportsComponent
      },
      {
        path:'approvals',component:ApprovalComponent
      },
      {
        path:'',redirectTo:'home',pathMatch:'full'
      }
    ]
  },
  {path:'sidebar',component:SidebarComponent},

  {
    path:'**',component:WildComponentComponent
  }
];

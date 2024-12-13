import { Routes } from '@angular/router';

import { DashboardComponent } from './Layout/dashboard/dashboard.component';
import { ViewRiskComponent } from './Pages/view-risk/view-risk.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';



import { AuthComponent } from './Layout/auth/auth.component';
import { LoginComponent } from './Pages/login/login.component';
import { UsersComponent } from './Pages/users/users.component';

import { HistoryComponent } from './Pages/history/history.component';
import { ReportsComponent } from './Pages/reports/reports.component';
import { ApprovalComponent } from './Pages/approval/approval.component';
import { WildComponentComponent } from './Pages/wild-component/wild-component.component';
import { RegisterRiskComponent } from './Pages/register-risk/register-risk.component';



import { ForgetpswrdComponent } from './Pages/forgetpswrd/forgetpswrd.component';
import { ResetpswrdComponent } from './Pages/resetpswrd/resetpswrd.component';
import { HomeComponent } from './Pages/home/home.component';
import { ApprovalTableComponent } from './Pages/approval-table/approval-table.component';


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
        path:'home',component:HomeComponent
      },
      {
        path:'ViewRisk/:id',component:ViewRiskComponent
      },
      // {path:"ViewRisk/:id",component:ViewRiskComponent}
      {
        path:'addrisk',component:RegisterRiskComponent
      },
      {
        path:'users',component:UsersComponent,data: { title: 'Users' },
      },
      {
        path:'history',component:HistoryComponent,data: { title: 'History' }
      },
      {
        path:'reports',component:ReportsComponent,data: { title: 'Reports' }
      },
      {
        path:'approvaltable',component:ApprovalTableComponent,data: { title: 'Approvals' }
      },
      {
        path:'approvals/:id',component:ApprovalComponent,data: { title: 'Approvals' }
      },
      {
        path:'approvals',component:ApprovalComponent,data: { title: 'Approvals' }
      },
      {
        path:'',redirectTo:'home',pathMatch:'full'
      }
    ]
  },
  {path:'sidebar',component:SidebarComponent},

  {
    path:"forgetpassword",component:ForgetpswrdComponent
  },
  {
    path:"resetpassword",component:ResetpswrdComponent
  },

  {

    path:'**',component:WildComponentComponent

  },




];

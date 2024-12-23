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
import { EditRiskComponent } from './Pages/edit-risk/edit-risk.component';
import { ChangepasswordComponent } from './Components/changepassword/changepassword.component';
import { ReferenceComponent } from './Pages/reference/reference.component';


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
        path:'home',component:HomeComponent, data:{title: 'Risk Management' }
      },
      {
        path:'ViewRisk/:id',component:ViewRiskComponent,  data: { title: 'View Risk' }
      },
      // {path:"ViewRisk/:id",component:ViewRiskComponent}
      {
        path:'addrisk',component:RegisterRiskComponent,data: { title: 'Register Risk' }
      },
      {
        path:'users',component:UsersComponent,data: { title: 'Manage Users and Departments' },
      },
      {
        path:'history',component:HistoryComponent,data: { title: 'History' }
      },
      {
        path:'reports',component:ReportsComponent,data: { title: 'Reports' }
      },
      {
        path:'approvaltable',component:ApprovalTableComponent, data: { title: 'Approvals' }
      },
      {
        path:'approvals/:id',component:ApprovalComponent,data: { title: 'Approvals' }
      },
      {
        path:'approvals',component:ApprovalComponent,data: { title: 'Approvals' }
      },
      {
        path:'edit',component:EditRiskComponent, data:{title: 'Edit Risk' }
      },
      {
        path:'',redirectTo:'home',pathMatch:'full', data:{title: 'Risk Management' }
      }
    ]
  },
  {
    path:"reference",component:ReferenceComponent
  },

  {path:'sidebar',component:SidebarComponent},

  {
    path:"forgetpassword",component:ForgetpswrdComponent
  },
  {
    path:"resetpassword",component:ResetpswrdComponent
  },
  {
    path:"changepassword",component:ChangepasswordComponent
  },


  {

    path:'**',component:WildComponentComponent

  },



];

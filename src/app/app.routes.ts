import { Routes } from '@angular/router';

import { DashboardComponent } from './Layout/dashboard/dashboard.component';
import { ViewRiskComponent } from './Pages/view-risk/view-risk.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';

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
import { SsoComponent } from './Pages/sso/sso.component';
import { AssignmentComponent } from './Pages/assignment/assignment.component';
import { UpdateRiskComponent } from './Pages/update-risk/update-risk.component';
import { ThankyouComponent } from './Pages/approved-response/approved-response.component';
import { RejectedResponseComponent } from './Pages/rejected-response/rejected-response.component';
import { VerificationSuccessComponent } from './Components/verification-success/verification-success.component';
import { AuthGuard } from './Gaurd/auth/auth.guard';
import { AuthComponent } from './Layout/auth/auth.component';
import { AuthComponentSSO } from './Gaurd/auth/auth.component';
import { UnauthorizedComponent } from './Pages/unauthorized/unauthorized.component';
import { DraftPageComponent } from './Pages/draft-page/draft-page.component';

export const routes: Routes = [
  {
    path: 'login',
    component: AuthComponent,
    children: [{ path:'', redirectTo: 'login', pathMatch: 'full' }],
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  {
    path: 'auth',
    component: AuthComponentSSO,
  },
  {
    path: 'sso',
    component: SsoComponent,
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { title: 'Risk Management', breadcrumb: 'Dashboard' },
    children: [
      {
        path: 'home',
        component: HomeComponent,
        data: { title: 'Risk Management' },
      },
      {
        path: 'ViewRisk/:id',
        component: ViewRiskComponent,
        data: { title: 'View Risk', breadcrumb: 'View Risk' },
      },

      {
        path: 'addrisk',
        component: RegisterRiskComponent,
        data: { title: 'Register Risk', breadcrumb: 'Register Risk' },
      },
      {
        path: 'users',
        component: UsersComponent,
        data: {
          title: 'Manage Users and Departments',
          breadcrumb: 'User Management',
        },
      },
      {
        path: 'assignments',
        component: AssignmentComponent,
        data: { title: 'Assignments', breadcrumb: 'Assignments' },
      },
      {
        path: 'history',
        component: HistoryComponent,
        data: { title: 'History', breadcrumb: 'History' },
      },
      {
        path: 'drafts',
        component: DraftPageComponent,
        data: { title: 'Draft', breadcrumb: 'Draft' },
      },
      {
        path: 'reports',
        component: ReportsComponent,
        data: { title: 'Reports', breadcrumb: 'Report' },
      },

      {
        path: 'approvals',
        component: ApprovalTableComponent,
        data: { title: 'Approvals', breadcrumb: 'Approvals' },
      },
      {
        path: 'approvals/:id',
        component: ApprovalComponent,
        data: { title: 'Approvals', breadcrumb: 'Approvals / View Risk' },
      },
      {
        path: 'reference',
        component: ReferenceComponent,
        data: { title: 'Reference', breadcrumb: 'Reference' },
      },
      {
        path: 'edit',
        component: EditRiskComponent,
        data: { title: 'Edit Risk', breadcrumb: 'View Risk / Edit Risk' },
      },
      {
        path: 'update',
        component: UpdateRiskComponent,
        data: { title: 'Update Risk', breadcrumb: 'View Risk / Close Risk' },
      },

      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
        data: { title: 'Risk Management', breadcrumb: 'Dashboard' },
      },
    ],
  },

  {
    path: 'sidebar',
    component: SidebarComponent,
  },
  {
    path: 'forgetpassword',
    component: ForgetpswrdComponent,
  },
  {
    path: 'resetpassword',
    component: ResetpswrdComponent,
  },
  {
    path: 'verification-success',
    component: VerificationSuccessComponent,
  },
  {
    path: 'changepassword',
    component: ChangepasswordComponent,
  },

  { path: 'thankyou/:id', component: ThankyouComponent },
  { path: 'sorry/:id', component: RejectedResponseComponent },

  {
    path: '**',
    component: WildComponentComponent,
  },
];

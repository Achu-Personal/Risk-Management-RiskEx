import { Routes } from '@angular/router';
import { DashboardComponent } from './Layout/dashboard/dashboard.component';
import { ViewRiskComponent } from './Pages/view-risk/view-risk.component';

export const routes: Routes = [
  {
    path:'',component:DashboardComponent
  },
  {
    path:'ViewRisk/:id',component:ViewRiskComponent
  },
  
];

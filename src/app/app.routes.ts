import { Routes } from '@angular/router';
import { DashboardComponent } from './Layout/dashboard/dashboard.component';
import { ViewRiskComponent } from './Pages/view-risk/view-risk.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';

export const routes: Routes = [
  {
    path:'',component:DashboardComponent
  },
  {
    path:'ViewRisk/:id',component:ViewRiskComponent
  },

  {path:'sidebar',component:SidebarComponent},
  {path:"dashbaord",component:DashboardComponent,children:[{path:"ViewRisk/:id",component:ViewRiskComponent}]}

];

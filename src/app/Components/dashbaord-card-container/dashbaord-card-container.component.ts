import { Component, Input } from '@angular/core';
import { DashboardviewriskComponent } from "../../UI/dashboardviewrisk/dashboardviewrisk.component";

@Component({
  selector: 'app-dashbaord-card-container',
  standalone: true,
  imports: [DashboardviewriskComponent],
  templateUrl: './dashbaord-card-container.component.html',
  styleUrl: './dashbaord-card-container.component.scss'
})
export class DashbaordCardContainerComponent {

  @Input() list=[]

  @Input() title=""

}

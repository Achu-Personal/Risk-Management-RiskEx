import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboardviewrisk',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './dashboardviewrisk.component.html',
  styleUrl: './dashboardviewrisk.component.scss'
})
export class DashboardviewriskComponent {


    @Input() data:any={}

    constructor(private router: Router)
    {

    }

    OnCardClicked(id:number)
    {
      this.router.navigate([`ViewRisk/${id}`]) //         /ViewRisk/${this.allData.id}/
    }

}

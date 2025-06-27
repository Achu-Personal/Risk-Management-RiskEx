import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboardviewrisk',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboardviewrisk.component.html',
  styleUrl: './dashboardviewrisk.component.scss',
})
export class DashboardviewriskComponent {
  @Input() data: any = {};

  constructor(private router: Router) {}

  OnCardClicked(id: number) {
    this.router.navigate([`ViewRisk/${id}`]); ///ViewRisk/${this.allData.id}/
  }
  get dynamicBackgroundColor(): string {
    if (this.data.overallRiskRatingBefore <= 45) {
      return 'green';
    }
    if (
      this.data.overallRiskRatingBefore >= 46 &&
      this.data.overallRiskRatingBefore <= 69
    ) {
      return '#FFBF00';
    }
    return 'red';
  }
}

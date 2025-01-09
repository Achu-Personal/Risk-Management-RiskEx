import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashbaord-open-risk-graph',
  standalone: true,
  imports: [NgFor],
  templateUrl: './dashbaord-open-risk-graph.component.html',
  styleUrl: './dashbaord-open-risk-graph.component.scss'
})
export class DashbaordOpenRiskGraphComponent {
  items = [
    { label: 'Category A', count: 125, color: '#3b82f6' },
    { label: 'Category B', count: 84, color: '#10b981' },
    { label: 'Category C', count: 56, color: '#f59e0b' }
  ];

  get maxCount() {
    return Math.max(...this.items.map(item => item.count));
  }

}

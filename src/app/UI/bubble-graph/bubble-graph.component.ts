import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bubble-graph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bubble-graph.component.html',
  styleUrl: './bubble-graph.component.scss'
})
export class BubbleGraphComponent {
  @Input() privacyRiskCount: number = 4;
  @Input() qualityRiskCount: number = 4;
  @Input() securityRiskCount: number = 10;

  ngOnInit() {


    // Log the value of qualityRiskCount
    console.log('qualityRiskCount on init:', this.securityRiskCount);
  }


  getDimension(value:number)
  {
    let sum=this.privacyRiskCount+this.qualityRiskCount+this.securityRiskCount
      return (((value/sum)*100)*2.5)
  }
}

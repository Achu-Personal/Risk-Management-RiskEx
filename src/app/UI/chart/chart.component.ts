import { BaseChartDirective } from 'ng2-charts';
import { Component, Input, SimpleChanges} from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

// Register the components
Chart.register(...registerables);



@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {


  @Input() labels:string[]=[];
  @Input() chartType: ChartType = 'line';
  @Input() datasets: any[]=[]

  chartData: ChartConfiguration['data'] = {
  datasets: this.datasets,
  labels: this.labels,
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0,
      },
    },
  };



  ngOnChanges(changes: SimpleChanges){
    if(changes['labels']){
      this.chartData.labels = this.labels;
    }

    if(changes['datasets']){
      this.chartData.datasets = this.datasets;
    }
  }

}









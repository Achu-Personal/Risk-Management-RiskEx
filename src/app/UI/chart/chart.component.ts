import { BaseChartDirective} from 'ng2-charts';
import { ChangeDetectorRef, Component, Input, SimpleChanges, ViewChild} from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin

// Register the components
Chart.register(...registerables, ChartDataLabels);



@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {
  @Input() labels: string[] = [];
  @Input() chartType: ChartType = 'bar';
  @Input() datasets: any[] = [];
  @Input() chartRouter: any = '';
  @Input() legend:boolean=true

  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  chartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: [],


  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: { tension: 0 },
    },
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      datalabels: {
        formatter: (value: any) => {
          return value;
        },
        color: '#000000', // Text color (e.g., red)
        font: {
          size: 14, // Font size
          // family: 'Arial', // Font family
          weight: 'bold', // Font weight (e.g., bold, normal, lighter)

        }
      },
      legend: {
      // position: 'right', // Legend on the right
      labels: {

        // padding: 30, // Adjust this to increase the gap
        boxWidth: 25,
        boxHeight: 8,
      font: {
      size: 10,
      family: 'Montserrat', // Font family
      weight: 'normal' // Font weight
      },
      color: '#000000'

      }

      },

      },
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['labels'] || changes['datasets']) {
      this.chartData.labels = [...this.labels];
      this.chartData.datasets = [...this.datasets];

      if (this.chart) {
        this.chart.update();
      }
    }

    if (changes['legend']) {
      this.lineChartOptions = this.lineChartOptions || {};
      this.lineChartOptions.plugins = this.lineChartOptions.plugins || {};
      this.lineChartOptions.plugins.legend = this.lineChartOptions.plugins.legend || {};
      this.lineChartOptions.plugins.legend.display = this.legend;
    }


  }

}


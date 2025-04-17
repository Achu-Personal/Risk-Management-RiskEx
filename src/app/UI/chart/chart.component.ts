import { BaseChartDirective } from 'ng2-charts';
import { ChangeDetectorRef, Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables, CategoryScale, } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


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
  @Input() legend: boolean = true


  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  chartData: ChartConfiguration['data'] & { type?: ChartType } = {
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
        color: '#000000',
        font: {
          size: 14,
          weight: 'bold',

        }
      },
      legend: {
        labels: {
          boxWidth: 25,
          boxHeight: 8,
          font: {
            size: 10,
            family: 'Montserrat',
            weight: 'normal'
          },
          color: '#000000'

        }

      },

    },
  };

  ngOnChanges(changes: SimpleChanges) {


    if (changes['labels'] || changes['datasets'] || changes['chartType']) {
      this.chartData.labels = [...this.labels];
      this.chartData.datasets = [...this.datasets];
      this.chartData.type = this.chartType;

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


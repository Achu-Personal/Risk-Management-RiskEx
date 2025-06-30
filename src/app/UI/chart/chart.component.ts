import { BaseChartDirective } from 'ng2-charts';
import { ChangeDetectorRef, Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables, CategoryScale, ChartEvent, ActiveElement, } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Router } from '@angular/router';


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


  constructor(private router:Router)
  {

  }

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
        color: 'white', // Text color (e.g., red)
        font: {
          size: 18, // Font size
          // family: 'Arial', // Font family
          weight: 'bold', // Font weight (e.g., bold, normal, lighter)

        }
      },
      legend: {
      position: 'right', // Legend on the right
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20, // Adjust this to increase the gap
        boxWidth: 20,
        boxHeight:20,
      font: {
      size: window.innerHeight * 0.021,
      family: '"Inter", sans-serif', // Font family
      weight: 'bold' // Font weight
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


    onChartClick(event: { event?: ChartEvent; active?: {}[] }) {
    if (event.active && event.active.length > 0) {
      const activeElement = event.active[0] as ActiveElement;
      const clickedIndex = activeElement.index;
      const label = this.labels[clickedIndex];

      if (label) {
       this.router.navigate([`reports`], { state: { type: label } });
      }
    }
  }

}


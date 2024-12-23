import { Component ,AfterViewInit} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import 'chartjs-chart-matrix';


Chart.register(...registerables);

@Component({
  selector: 'app-heatmap',
  standalone: true,
  imports: [],
  templateUrl: './heatmap.component.html',
  styleUrl: './heatmap.component.scss'
})
export class HeatmapComponent implements AfterViewInit {
  ngAfterViewInit() {
    this.createHeatmap();
  }
  createHeatmap() {
    const canvas = document.getElementById('heatmapCanvas') as HTMLCanvasElement | null;

    if (canvas) {
      const ctx = canvas.getContext('2d');

      if (ctx) {
        const heatmapData = [
          [2, 4, 8, 16],
          [4, 8, 16, 32],
          [8, 16, 32, 64],
          [20, 40, 80, 100],
        ];

        const dataset = [];
        for (let row = 0; row < heatmapData.length; row++) {
          for (let col = 0; col < heatmapData[row].length; col++) {
            dataset.push({
              x: col,
              y: row,
              v: heatmapData[row][col],
            });
          }
        }

        const xLabels = ['Low', 'Medium', 'High', 'Critical'];
        const yLabels = ['0.25', '0.50', '0.75', '1.00'];

        new Chart(ctx, {
          type: 'matrix',
          data: {
            datasets: [
              {
                label: 'Likelihood and Impact Heatmap',
                data: dataset,
                backgroundColor: (context: any) => {
                  const value = context.raw.v;
                  if (value <= 10) return '#DAF7A6'; // Green for low values
                  if (value <= 30) return '#FFC300'; // Yellow for medium values
                  if (value <= 70) return '#FF5733'; // Orange for high values
                  return '#C70039'; // Red for critical values
                },
                borderColor: 'white',
                borderWidth: 1,
                width: () => 50,
                height: () => 50,
              },
            ],
          },
          options: {
            plugins: {
              tooltip: {
                callbacks: {
                  // label: (context) => `Value: ${context.raw.v}`,
                },
              },
            },
            scales: {
              x: {
                type: 'category',
                labels: xLabels,
                title: { display: true, text: 'Impact' },
              },
              y: {
                type: 'category',
                labels: yLabels,
                title: { display: true, text: 'Likelihood' },
              },
            },
          },
        });
      } else {
        console.error('Could not get 2D context from the canvas.');
      }
    } else {
      console.error('Canvas element not found.');
    }
  }


}

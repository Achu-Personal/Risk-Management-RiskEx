import { ChartType } from 'chart.js';
import { Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { SearchboxComponent } from "../../UI/searchbox/searchbox.component";
import { ButtonComponent } from "../../UI/button/button.component";
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { DepartmentDropdownComponent } from "../../Components/department-dropdown/department-dropdown.component";
import { ChartComponent } from "../../UI/chart/chart.component";
import { TableComponent } from "../../Components/table/table.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BodyContainerComponent, ButtonComponent, DepartmentDropdownComponent, ChartComponent, TableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
// data:any
// onDropdownChange($event: string) {
// }

graph3labels:string[]=["Delivery Units","L&D","Sfm", "HR"];
graph3chartType:any='bar'
graph3datasets:any[]=[
  {
    data:[40,40,40,40],
    label:"Quality",
    backgroundColor: '#51AEF2',
    yAxisID: 'y1',
    borderColor: '#3E68B9',
    pointBackgroundColor: '#3E68B9',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: '#3E68B9',
    barPercentage: 0.7, // Reduce individual bar width
    categoryPercentage: 0.4 // Increase spacing between categories

  },
  {
    data:[35,35,35,35],
    label:"Privacy",
    backgroundColor: '#6993E4',
    yAxisID: 'y1',
    borderColor: '#3E68B9',
    pointBackgroundColor: '#3E68B9',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: '#3E68B9',
    barPercentage: 0.7, // Reduce individual bar width
    categoryPercentage: 0.4// Increase spacing between categories
  },
  {
    data:[25,25,25,25],
    label:"Security",
    backgroundColor: '#979797',
    yAxisID: 'y1',
    borderColor: '#3E68B9',
    pointBackgroundColor: '#3E68B9',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: '#3E68B9',
    barPercentage: 0.7, // Reduce individual bar width
    categoryPercentage: 0.4 // Increase spacing between categories
  },

]
// Options should be defined separately, not inside the datasets array
graph3options: any = {
  plugins: {
    legend: {
      display: true,
      labels: {
        boxWidth: 5,          // Reduce the width of the color box
        boxHeight: 5,         // Optional: Adjust height for consistency
        usePointStyle: true,   // Use smaller shapes for legend icons
        pointStyle: 'Circle', // Example shape: circle, rectRounded, etc.
        padding: 10            // Add spacing between legend items
      }
    }
  },
  responsive: true,
  scales: {
    y: {
      beginAtZero: true // Ensure the Y-axis starts at 0
    }
  }
};



graph2labels:string[]=[];
graph2chartType:any='doughnut'
graph2datasets:any[]=[
  {
    data:[40],
    label:"Quality",
    backgroundColor: '#51AEF2',
    yAxisID: 'y1',
    // borderColor: '#3E68B9',
    pointBackgroundColor: '#51AEF2',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: '#3E68B9',
  },
  {
    data:[35],
    label:"Privacy",
    backgroundColor: '#6993E4',
    yAxisID: 'y1',
    // borderColor: '#3E68B9',
    pointBackgroundColor: 'rgb(62, 104, 185, 0.6)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: '#3E68B9',
    responsive: true,
  },
  {
    data:[25],
    label:"Security",
    backgroundColor: '#979797',
    yAxisID: 'y1',
    // borderColor: '#3E68B9',
    pointBackgroundColor: 'rgb(62, 104, 185, 0.4)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: '#3E68B9',
    responsive: true,
    // plugins: {
    //   legend: {
    //     position: 'top' // Or 'top', 'right', 'left'
    //   }
    // }
  },
]

graph2options: any = {
  plugins: {
    legend: {
      display: true,
      labels: {
        boxWidth: 5,          // Reduce the width of the color box
        boxHeight: 5,         // Optional: Adjust height for consistency
        usePointStyle: true,   // Use smaller shapes for legend icons
        pointStyle: 'Circle', // Example shape: circle, rectRounded, etc.
        padding: 10            // Add spacing between legend items
      }
    }
  },
  responsive: true,
  scales: {
    y: {
      beginAtZero: true // Ensure the Y-axis starts at 0
    }
  }
};


graph1labels:string[]=["Critical","Moderate","Low"];
graph1chartType:any='line'
graph1datasets:any[]=[
  {
    data:[45],
    label:"Critical",
    backgroundColor: '#3E68B9',
    yAxisID: 'y1',
    // borderColor: '#3E68B9',
    pointBackgroundColor: '#3E68B9',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: '#3E68B9',
    barPercentage: 0.5, // Reduce individual bar width
    categoryPercentage: 0.7 // Increase spacing between categories
  },
  {
    data:[30],
    label:"Moderate",
    backgroundColor: 'pink',
    yAxisID: 'y1',
    // borderColor: '#3E68B9',
    pointBackgroundColor: '#3E68B9',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: '#3E68B9',
    // responsive: true,
    barPercentage: 0.5, // Reduce individual bar width
    categoryPercentage: 0.7 // Increase spacing between categories
  },
  {
    data:[25],
    label:"Low",
    backgroundColor: 'green',
    yAxisID: 'y1',
    // borderColor: '#3E68B9',
    pointBackgroundColor: '#3E68B9',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: '#3E68B9',
    barPercentage: 0.9, // Reduce individual bar width
    categoryPercentage: 0.7 // Increase spacing between categories
    // responsive: true,
    // plugins: {
    //   legend: {
    //     position: 'top' // Or 'top', 'right', 'left'
    //   }
    // }
  },
]

graph1options: any = {
  plugins: {
    legend: {
      display: true,
      labels: {
        boxWidth: 5,          // Reduce the width of the color box
        boxHeight: 5,         // Optional: Adjust height for consistency
        usePointStyle: true,   // Use smaller shapes for legend icons
        pointStyle: 'Circle', // Example shape: circle, rectRounded, etc.
        padding: 10            // Add spacing between legend items
      }
    }
  },
  responsive: true,
  scales: {
    y: {
      beginAtZero: true // Ensure the Y-axis starts at 0
    }
  }
};


}

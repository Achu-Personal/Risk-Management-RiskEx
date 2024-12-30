import { ChartType } from 'chart.js';
import { Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { SearchboxComponent } from "../../UI/searchbox/searchbox.component";
import { ButtonComponent } from "../../UI/button/button.component";
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { DepartmentDropdownComponent } from "../../Components/department-dropdown-dashboard/department-dropdown.component";
import { ChartComponent } from "../../UI/chart/chart.component";
import { TableComponent } from "../../Components/table/table.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BodyContainerComponent, ButtonComponent, DepartmentDropdownComponent, ChartComponent, TableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private router: Router) {}

  OnClickRow(rowid:any): void {
    this.router.navigate([`/ViewRisk/${rowid}`]);
    console.log("rowdata",rowid);

  }
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



graph2labels:string[]=['Low',
    'Moderate',
    'Critical'];
graph2chartType:any='doughnut'
graph2datasets:any[]=[


  {

    data: [10, 21, 19],
    backgroundColor: [
     '#962DFF',
      '#E0C6FD',
      '#C6D2FD'
    ],
    hoverOffset: 10
  }

]













  // {
  //   data:[40],
  //   label:"Quality",
  //   backgroundColor: '#51AEF2',
  //   yAxisID: 'y1',
  //   // borderColor: '#3E68B9',
  //   pointBackgroundColor: '#51AEF2',
  //   // pointBorderColor: '#fff',
  //   // pointHoverBackgroundColor: '#fff',
  //   pointHoverBorderColor: '#3E68B9',
  // },
  // {
  //   data:[35],
  //   label:"Privacy",
  //   backgroundColor: '#6993E4',
  //   yAxisID: 'y1',
  //   // borderColor: '#3E68B9',
  //   pointBackgroundColor: 'rgb(62, 104, 185, 0.6)',
  //   // pointBorderColor: '#fff',
  //   // pointHoverBackgroundColor: '#fff',
  //   pointHoverBorderColor: '#3E68B9',
  //   responsive: true,
  // },
  // {
  //   data:[25],
  //   label:"Security",
  //   backgroundColor: '#979797',
  //   yAxisID: 'y1',
  //   // borderColor: '#3E68B9',
  //   pointBackgroundColor: 'rgb(62, 104, 185, 0.4)',
  //   // pointBorderColor: '#fff',
  //   // pointHoverBackgroundColor: '#fff',
  //   pointHoverBorderColor: '#3E68B9',
  //   responsive: true,
  //   // plugins: {
  //   //   legend: {
  //   //     position: 'top' // Or 'top', 'right', 'left'
  //   //   }
  //   // }
  // },


// graph2options: any = {
//   plugins: {
//     legend: {
//       display: true,
//       labels: {
//         boxWidth: 5,          // Reduce the width of the color box
//         boxHeight: 5,         // Optional: Adjust height for consistency
//         usePointStyle: true,   // Use smaller shapes for legend icons
//         pointStyle: 'Circle', // Example shape: circle, rectRounded, etc.
//         padding: 10            // Add spacing between legend items
//       }
//     }
//   },
//   responsive: true,
//   scales: {
//     y: {
//       beginAtZero: true // Ensure the Y-axis starts at 0
//     }
//   }
// };


// graph1labels:string[]=["Critical","Moderate","Low"];
// graph1chartType:any='line'
// graph1datasets:any[]=[
//   {
//     data:[45,null,null],
//     label:"Critical",
//     backgroundColor: 'rgb(232, 8, 8,0.7)',
//     yAxisID: 'y1',
//     // borderColor: '#red',
//     pointBackgroundColor: 'rgb(232, 8, 8,0.7)',
//     // pointBorderColor: '#E80808',
//     pointHoverBackgroundColor: '#E80808',
//     pointHoverBorderColor: '#E80808',
//     tension: 0.1,

//   },
//   {
//     data:[null,30,null],
//     label:"Moderate",
//     backgroundColor: 'rgb(255, 180, 79)',
//     yAxisID: 'y1',
//     // borderColor: 'orange',
//     pointBackgroundColor: 'rgb(255, 180, 79)',
//     pointBorderColor: 'rgb(255, 180, 79)',
//     pointHoverBackgroundColor: 'rgb(255, 180, 79)',
//     pointHoverBorderColor: 'rgb(255, 180, 79)',
//     // responsive: true,
//     tension: 0.1,
//   },
//   {
//     data:[null,null,25],
//     label:"Low",
//     backgroundColor: '  rgb(31, 146, 84)',
//     yAxisID: 'y1',
//     // borderColor: 'yellow',
//     pointBackgroundColor: ' rgb(31, 146, 84)',
//     pointBorderColor: ' rgb(31, 146, 84)',
//     pointHoverBackgroundColor: ' rgb(31, 146, 84)',
//     pointHoverBorderColor: 'rgb(31, 146, 84)',
//     tension: 0.1,


//   },
// ]

graph1labels: string[] = ["Critical", "Moderate", "Low"]; // X-axis labels
graph1chartType:any='line'

graph1datasets: any[] = [
  {
    data: [45, 30, 25], // Values to connect with a line
    label: "Risk Metrics",
    backgroundColor: 'rgb(81, 174, 242,0.8)', // Light blue background
    borderColor: 'rgb(81, 174, 242,0.8)', // Light blue line
    pointBackgroundColor: ['red', 'orange', 'green'], // Point colors
    pointBorderColor: '#fff',
    pointRadius: 5, // Size of points
    pointHoverRadius: 8,
    tension: 0.1, // Smooth curve
  },
];


// Chart options with labels plugin







}

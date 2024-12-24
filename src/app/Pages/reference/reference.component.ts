import { Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { ReferncetableComponent } from "../../Components/referncetable/referncetable.component";
import { HeatmapComponent } from "../../Components/heatmap/heatmap.component";
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-reference',
  standalone: true,
  imports: [BodyContainerComponent, ReferncetableComponent, HeatmapComponent,NgFor,NgIf],
  templateUrl: './reference.component.html',
  styleUrl: './reference.component.scss'
})
export class ReferenceComponent {

  selectedTab:number = 0;
  tabs = [
   
    { label: 'Likelihood' },
    { label: 'Impact' },
    { label: 'QMS Risk Rating' },
    { label: 'ISMS Risk Rating' },
    { label: 'Risk Response Table' },
    
  ];

  likelyHoodTableHead:string[]=["LikelyHood","Definitions"];
  likelyHoodTableBody:any=[
    {LikelyHood:"Low", Definitions:"1-24% chance of occurrence"},
    {LikelyHood:"Medium", Definitions:"25-49% chance of occurrence"},
    {LikelyHood:"High", Definitions:"50-74% chance of occurrence"},
    {LikelyHood:"Critical", Definitions:"75-99% chance of occurrence"},
  
  ];
  impactTableHead:string[]=["Impact","Definitions"];
  impactTableBody:any =[
    {Impact:"Low", Definitions:"No/slight effect on business"},
    {Impact:"Medium", Definitions:"business objectives affected"},
    {Impact:"High", Definitions:"business objectives undermined"},
    {Impact:"Critical", Definitions:"business objectives not accomplished"}
  ]

  riskResponseHead:string[]=["Risk Response", "Description","Example"]
  riskResponseBody:any[]=
    [
      {
        "Risk Response": "Avoid",
        "Description": "This strategy aims to eliminate the risk entirely by taking actions that prevent the risk from occurring. It involves altering project plans or processes to steer clear of the risk's potential impact.",
        "Example": "Changing a project scope to exclude a high-risk feature that could lead to technical challenges."
      },
      {
        "Risk Response": "Mitigate",
        "Description": "Mitigation involves taking proactive steps to reduce the likelihood or impact of a risk. It focuses on minimizing the risk's negative effects while still allowing the project or function to move forward.",
        "Example": "Developing a backup system to reduce the impact of potential server failures."
      },
      {
        "Risk Response": "Transfer",
        "Description": "Transferring the risk involves shifting the responsibility for managing the risk to another party. This could be achieved through insurance, outsourcing, partnerships, or contracts.",
        "Example": "Purchasing insurance to cover financial losses due to unforeseen events."
      },
      {
        "Risk Response": "Accept",
        "Description": "Accepting the risk means acknowledging its existence and choosing not to take specific actions to mitigate or avoid it.",
        "Example": "Deciding not to invest in additional security for a low-value system because the cost of mitigation exceeds the potential impact of the risk."
      }
    ];
    QMStablehead:string[]=["RiskFactor","Risk Rating Category","Action"];





    QMSTablebody:any=
    [
      {
        "RiskFactor": "Risk Factor <= 8",
        "Risk Rating Category": "Low Risk",
        "Action": "Appropriate action plan to be captured"
      },
      {
        "RiskFactor": "Risk Factor >= 10 and <= 32",
        "Risk Rating Category": "Moderate Risk",
        "Action": "Mitigation and Contingency Plan are identified and closely tracked by PM. PM needs to monitor risks every week"
      },
      {
        "RiskFactor": "Risk Factor >= 40",
        "Risk Rating Category": "Critical Risk",
        "Action": "PM identifies the appropriate mitigation and contingency plans. Critical risks shall be monitored on a daily basis and these risks should be highlighted in project review meetings"
      }
    ];

    ISMSTableHead:string[]=["Risk Value","Risk Rating"]

ISMSTableBody:any=[
  {
    "Risk Value": "Risk Value <= 30",
    "Risk Rating": "Green"
  },
  {
    "Risk Value": "31 <= Risk Value <= 99",
    "Risk Rating": "Amber"
  },
  {
    "Risk Value": "100 <= Risk Value <= 300",
    "Risk Rating": "Red"
  }
]

    selectTab(index: number): void {
      this.selectedTab = index;
    }
     

}

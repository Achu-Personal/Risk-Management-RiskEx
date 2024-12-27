import { Component } from '@angular/core';
import { BodyContainerComponent } from '../../Components/body-container/body-container.component';
import { ReferncetableComponent } from '../../Components/referncetable/referncetable.component';
import { HeatmapComponent } from '../../Components/heatmap/heatmap.component';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../Services/api.service';

@Component({
  selector: 'app-reference',
  standalone: true,
  imports: [
    BodyContainerComponent,
    ReferncetableComponent,
    HeatmapComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './reference.component.html',
  styleUrl: './reference.component.scss',
})
export class ReferenceComponent {
  constructor(private api: ApiService) {}
  riskResponseBody: any;
  likelyHoodTableBody: any;
  impactTableBody: any;


  ngOnInit(): void {
    this.api.getRiskResponses().subscribe((e) => {
      console.log('Data=', e);
      this.riskResponseBody = e;
    });

    this.api.getLikelyHoodDefinition().subscribe((e) => {
      this.likelyHoodTableBody = e;
    });
    this.api.getImpactDefinition().subscribe((e) => {
      this.impactTableBody = e;
    });
  }

  
  selectedTab: number = 0;
  tabs = [
    { label: 'Likelihood' },
    { label: 'Impact' },
    { label: 'QMS Risk Rating' },
    { label: 'ISMS Risk Rating' },
    { label: 'Risk Response Table' },
  ];

  likelyHoodTableHead: string[] = ['likelihood', 'definition'];
  impactTableHead: string[] = ['impact', 'definition'];
  riskResponseHead: string[] = ['name', 'description', 'example'];
  QMStablehead: string[] = ['RiskFactor', 'Risk Rating Category', 'Action'];
  QMSTablebody: any = [
    {
      RiskFactor: 'Risk Factor <= 8',
      'Risk Rating Category': 'Low Risk',
      Action: 'Appropriate action plan to be captured',
    },
    {
      RiskFactor: 'Risk Factor >= 10 and <= 32',
      'Risk Rating Category': 'Moderate Risk',
      Action:
        'Mitigation and Contingency Plan are identified and closely tracked by PM. PM needs to monitor risks every week',
    },
    {
      RiskFactor: 'Risk Factor >= 40',
      'Risk Rating Category': 'Critical Risk',
      Action:
        'PM identifies the appropriate mitigation and contingency plans. Critical risks shall be monitored on a daily basis and these risks should be highlighted in project review meetings',
    },
  ];

  ISMSTableHead: string[] = ['Risk Value', 'Risk Rating'];

  ISMSTableBody: any = [
    {
      'Risk Value': 'Risk Value <= 30',
      'Risk Rating': 'Green',
    },
    {
      'Risk Value': '31 <= Risk Value <= 99',
      'Risk Rating': 'Amber',
    },
    {
      'Risk Value': '100 <= Risk Value <= 300',
      'Risk Rating': 'Red',
    },
  ];

  selectTab(index: number): void {
    this.selectedTab = index;
  }
}

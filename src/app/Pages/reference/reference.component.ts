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
  constructor(private api: ApiService) { }
  riskResponseBody: any;
  likelyHoodTableBody: any;
  impactTableBody: any;
  QMStablehead: any;
  QMSTablebody: any;
  ISMSTableHead: any;
  ISMSTableBody: any;
  RiskStatusHead: any;
  RiskStatusBody: any;
  QMSImpactHead: any;
  QMSImpactBody: any;
  ISMSImpactHead: any;
  ISMSImpactBody: any;


  ngOnInit(): void {
    this.api.getRiskResponses().subscribe((e) => {
      this.riskResponseBody = e;
    });

    this.api.getLikelyHoodDefinition().subscribe((e) => {
      console.log('Likelihood Data=', e);
      this.likelyHoodTableBody = e;
    });
    this.api.getImpactDefinition().subscribe((e) => {
      this.impactTableBody = e;
    });
    this.api.getReferenceTableData().subscribe((data: any) => {
      this.QMStablehead = data.QMSTable.head || [];
      this.QMSTablebody = data.QMSTable.body || [];
      this.ISMSTableHead = data.ISMSTable.head || [];
      this.ISMSTableBody = data.ISMSTable.body || [];
      this.RiskStatusHead = data.RiskStatusTable.head || [];
      this.RiskStatusBody = data.RiskStatusTable.body || [];
      this.QMSImpactHead = data.QMSImpactDefinitions.head || [];
      this.QMSImpactBody = data.QMSImpactDefinitions.body || [];
      this.ISMSImpactHead = data.ISMSImpactDefinitions.head || [];
      this.ISMSImpactBody = data.ISMSImpactDefinitions.body || [];
    });

  }

  selectedTab: number = 0;
  tabs = [
    { label: 'Likelihood' },
    { label: 'Impact' },
    { label: 'Risk Acceptance Criteria - QMS' },
    { label: 'Risk Acceptance Criteria - ISMS' },
    { label: 'Risk Response ' },
    { label: 'Risk Status' },
    { label: 'QMS Impact ' },
    { label: 'ISMS Impact ' },
  ];

  likelyHoodTableHead: string[] = ['likelihood', 'definition','chanceOfOccurance'];

  likelyHoodTableHeadLabels: string[] = ['Likelihood', 'Definition', 'Chance of Occurrence'];

  impactTableHead: string[] = ['impact', 'definition'];
  riskResponseHead: string[] = ['name', 'description', 'example'];

  selectTab(index: number): void {
    this.selectedTab = index;
  }
}


import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { DropdownComponent } from '../../UI/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';



@Component({
  selector: 'app-form-dropdown',
  standalone: true,
  imports: [DropdownComponent,CommonModule],
  templateUrl: './form-dropdown.component.html',
  styleUrl: './form-dropdown.component.scss'
})
export class FormDropdownComponent implements OnInit {
  tooltipData={
    "likelihood": {
      "header": ["Likelihood", "Definitions", "Chance of Occurrence"],
      "rows": [
        {
          "type": "Low",
          "definition": "The probability of the risk occurring is minimal, with little to no historical evidence or indication of occurrence.",
          "chance": "≤10%"
        },
        {
          "type": "Medium",
          "definition": "There is a moderate probability of the risk occurring. It may have occurred in the past under similar circumstances.",
          "chance": "10-50%"
        },
        {
          "type": "High",
          "definition": "The probability of the risk occurring is significant, and it is likely to happen based on historical trends or current conditions.",
          "chance": "50-90%"
        },
        {
          "type": "Critical",
          "definition": "The risk is almost certain to occur, with a very high probability of materializing.",
          "chance": "≥90%"
        }
      ]
    },
    "impact": {
      "header": ["Impact", "Definitions"],
      "rows": [
        {
          "type": "Low",
          "definition": "The consequences of the risk are minimal, with negligible effects on the organization's operations, finances, or reputation."
        },
        {
          "type": "Medium",
          "definition": "The consequences of the risk are moderate, causing some disruption or financial loss, but manageable without significant impact on key objectives."
        },
        {
          "type": "High",
          "definition": "The consequences of the risk are significant, causing major disruptions, substantial financial losses, or harm to the organization's reputation."
        },
        {
          "type": "Critical",
          "definition": "The consequences of the risk are severe, potentially threatening the organization's ability to operate or causing irreparable harm."
        }
      ]
    }
  }



  @Input() tooltipType: 'likelihood' | 'impact' = 'likelihood'; // Input to specify type
  messageHtml: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.generateTable(this.tooltipType);
  }

  generateTable(type: 'likelihood' | 'impact') {
    const data = this.tooltipData[type];

    if (!data) return;

    // Generate table HTML dynamically
    let tableHtml = `<table border="1" cellspacing="0" cellpadding="8">
      <thead>
        <tr>
          ${data.header.map((header: string) => `<th>${header}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${data.rows
          .map(
            (row: any) => `
          <tr>
            <td><b>${row.type}</b></td>
            <td>${row.definition}</td>
            ${row.chance ? `<td>${row.chance}</td>` : ''}
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>`;

    // Trust the generated HTML
    this.messageHtml = this.sanitizer.bypassSecurityTrustHtml(tableHtml);
  }
  @Input() dropdownData:any[]=[]
  @Input() dropdownDisplay:string=''
  @Input() dropdownValue:string=''
   @Input() dropdownCode:string=''
    @Input() showInfoButton:boolean=false
  @Input() label:string=''
  @Input() required:string=''
  @Input() selectValue:string=''
  @Output() change = new EventEmitter<any>();
  @Input() selectedValue: any = null;
  @Input() openDropdownId: string | undefined = undefined; // Get from parent
  @Output() openDropdown = new EventEmitter<string>(); // Notify parent
  @Input() message:string=''
  @Input() backgroundColor:string=''





  onChange(event: any): void {


    this.change.emit(event);


  }






  dropdownId = Math.random().toString(36).substring(2, 9); // Generate unique ID

  toggleDropdown() {
    this.openDropdown.emit(this.dropdownId); // Notify parent

  }

  get isDropdownOpen() {
    return this.openDropdownId === this.dropdownId;
  }



}

import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-referncetable',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './referncetable.component.html',
  styleUrl: './referncetable.component.scss'
})
export class ReferncetableComponent {
  @Input() tableHead: string[] = [];
  @Input() tableHeadLabels: string[] = []; // Display labels for headers
  @Input() tableBody: any[] = [];
  @Input() backgroundColor: any;
  @Input() textAlign: 'left' | 'center' | 'right' | 'justify' = 'left';

  get displayHeaders(): string[] {
    return this.tableHeadLabels.length > 0 ? this.tableHeadLabels : this.tableHead;
  }
  getCellStyle(value: any): { [key: string]: string } {
    if (!value || typeof value !== 'string') return {};

    switch (value.toLowerCase()) {
      case 'low risk':
        return { backgroundColor: 'green', color: 'white' };
      case 'moderate risk':
        return { backgroundColor: '#FFC107', color: 'black' }; // Amber color
      case 'medium risk':
        return { backgroundColor: '#FFC107', color: 'black' }; // Amber color
      case 'critical risk':
        return { backgroundColor: 'red', color: 'white' };
      case 'green':
        return { backgroundColor: 'green', color: 'white' };
      case 'amber':
        return { backgroundColor: '#FFC107', color: 'black' }; // Amber color
      case 'red':
        return { backgroundColor: 'red', color: 'white' };
      default:
        return {};
    }
  }

  getCombinedCellStyle(value: any): { [key: string]: string } {
    const colorStyle = this.getCellStyle(value);
    const alignmentStyle = { textAlign: this.textAlign };
    return { ...colorStyle, ...alignmentStyle };
  }

  getAlignmentClass(): string {
    return `text-align-${this.textAlign}`;
  }
}

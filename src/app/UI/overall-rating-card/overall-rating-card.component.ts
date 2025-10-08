import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overall-rating-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overall-rating-card.component.html',
  styleUrls: ['./overall-rating-card.component.scss'],
})
export class OverallRatingCardComponent {
  @Input() value: number = 0;
  @Input() title: string = '';
  @Input() backgroundColor: string = '';
  @Input() textColor: string = '';
  @Input() height: string = '100%';
  @Input() width: string = '90%';
  @Input() assessmentData: any[] = [];
  @Input() riskType = 'Quality';

  isHovered: boolean = false;
  criticality = true;

  get getCriticality(): string {
    if (this.riskType === 'Quality') {
      // Calculation specific to Quality risk type
      if (this.value <= 4) {
        return 'Low';
      }
      if (this.value >= 6 && this.value <= 16) {
        return 'Moderate';
      }
      return 'Critical';
    } else {
      // Calculation for other risk types
      if (this.value <= 45) {
        return 'Low';
      }
      if (this.value >= 46 && this.value <= 69) {
        return 'Moderate';
      }
      return 'Critical';
    }
  }

  get dynamicBackgroundColor(): string {
    if (this.backgroundColor) {
      return this.backgroundColor;
    }

    if (this.riskType === 'Quality') {
      // Calculation specific to Quality risk type
      if (this.value <= 8) {
        return 'green';
      }
      if (this.value > 8 && this.value <= 32) {
        return '#FFBF00'; // Moderate
      }
      return 'red'; // Critical
    } else {
      // Calculation for other risk types
      if (this.value <= 45) {
        return 'green';
      }
      if (this.value >= 46 && this.value <= 69) {
        return '#FFBF00'; // Moderate
      }
      return 'red'; // Critical
    }
  }

  get dynamicTextColor(): string {
    if (this.textColor) {
      return this.textColor;
    }

    if (this.riskType === 'Quality') {
      // Calculation specific to Quality risk type
      if (this.value <= 8) {
        return 'green';
      }
      if (this.value > 8 && this.value <= 32) {
        return '#FFBF00'; // Moderate
      }
      return 'red'; // Critical
    } else {
      // Calculation for other risk types
      if (this.value <= 45) {
        return 'green';
      }
      if (this.value >= 46 && this.value <= 69) {
        return '#FFBF00'; // Moderate
      }
      return 'red'; // Critical
    }
  }

  // Return dynamic styles for width, height, background, and text color
  get dynamicStyles(): { [key: string]: string } {
    return {
      'background-color': this.dynamicBackgroundColor,
      color: this.dynamicTextColor,
      height: this.height,
      width: '100%',
      transition: 'all 0.5s ease',
    };
  }
}

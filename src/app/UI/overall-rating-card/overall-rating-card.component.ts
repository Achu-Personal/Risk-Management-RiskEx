import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overall-rating-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overall-rating-card.component.html',
  styleUrls: ['./overall-rating-card.component.scss']
})
export class OverallRatingCardComponent {

  @Input() value: number = 0;
  @Input() title: string = '';
  @Input() backgroundColor: string = '';
  @Input() textColor: string = '';
  @Input() height: number = 45; // Default height in vh
  @Input() width: number = 45; // Default width in vh
  @Input() assessmentData: any[] = [];

  isHovered: boolean = false;
  criticality=true;


  get getCriticality():string{
    if (this.value <= 45) {
      return 'Low';
    }
    if (this.value >= 46 && this.value <= 69) {
      return 'Medium';
    }
    return 'High';
  }

  // Get dynamic background color based on input or value
  get dynamicBackgroundColor(): string {
    if (this.backgroundColor) {
      return this.backgroundColor;
    }
    if (this.value <= 45) {
      return 'green';
    }
    if (this.value >= 46 && this.value <= 69) {
      return '#FFBF00';
    }
    return 'red';
  }

  // Get dynamic text color based on input or value
  get dynamicTextColor(): string {
    if (this.textColor) {
      return this.textColor;
    }
    if (this.value <= 45) {
      return 'green';
    }
    if (this.value >= 46 && this.value <= 69) {
      return '#FFBF00';
    }
    return 'red';
  }

  // Return dynamic styles for width, height, background, and text color
  get dynamicStyles(): { [key: string]: string } {
    return {
      'background-color': this.dynamicBackgroundColor,  // Dynamic background color
      'color': this.dynamicTextColor,  // Dynamic text color
      'height':this.height+"vh",
      'width':this.width+"vh",
      'transition': 'all 0.5s ease',   // Transition for smooth resizing
    };
  }
}

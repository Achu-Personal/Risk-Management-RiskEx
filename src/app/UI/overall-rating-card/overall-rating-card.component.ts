import { CommonModule } from '@angular/common';
import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-overall-rating-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overall-rating-card.component.html',
  styleUrl: './overall-rating-card.component.scss'
})
export class OverallRatingCardComponent {

  @Input() value: number = 0;
  @Input() title: string = '';
  @Input() backgroundColor: string = '';
  @Input() textColor: string = '';
  @Input() height: number = 37; // Default height in vh
  @Input() width: number = 37; // Default width in vh

  get dynamicBackgroundColor(): string {
    if (this.backgroundColor) {
      return 'var(--primary-color)';
    }
    if (this.value <= 30) {
      return 'green';
    }
    if (this.value > 30 && this.value < 99) {
      return '#FFBF00';
    }
    return 'red';
  }

  get dynamicTextColor(): string {
    if (this.textColor) {
      return 'black';
    }
    if (this.value <= 30) {
      return 'green';
    }
    if (this.value > 30 && this.value < 99) {
      return '#FFBF00';
    }
    return 'red';
  }

  get dynamicStyles(): { [key: string]: string } {
    return {
      'background-color': this.dynamicBackgroundColor,
      'color': this.dynamicTextColor,
      'height': `${this.height}vh`,
      'width': `${this.width}vh`,
    };
  }





}

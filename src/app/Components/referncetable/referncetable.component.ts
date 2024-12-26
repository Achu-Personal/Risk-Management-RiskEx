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
@Input() tableHead:string[]=[];
@Input() tableBody:any[]=[];
@Input() backgroundColor:any;

getCellStyle(value: string): { [key: string]: string } {
  if (!value) return {};

  // Define background colors for different rating categories
  switch (value.toLowerCase()) {
      case 'low risk':
          return { backgroundColor: 'green', color: 'white' };
      case 'moderate risk':
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
          return {}; // Default style for unrecognized values
  }
}


}

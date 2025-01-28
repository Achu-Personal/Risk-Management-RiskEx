import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'residualRiskStatusStyle',
  standalone: true
})
export class ResidualRiskStatusStylePipe implements PipeTransform {

  transform(residualrisk: string): string {
    switch(residualrisk) {
      case 'Low': return 'green-cell';
      case 'Medium': return 'yellow-cell';
      case 'High': return 'red-cell';
      default: return '';
    }
  }

}

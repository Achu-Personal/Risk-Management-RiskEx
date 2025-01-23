import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'residualRiskStatusStyle',
  standalone: true
})
export class ResidualRiskStatusStylePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}

import { Component, EventEmitter, Output } from '@angular/core';
import { HeatmapComponent } from '../heatmap/heatmap.component';

@Component({
  selector: 'app-form-reference-heatmap-popup',
  standalone: true,
  imports: [HeatmapComponent],
  templateUrl: './form-reference-heatmap-popup.component.html',
  styleUrl: './form-reference-heatmap-popup.component.scss'
})
export class FormReferenceHeatmapPopupComponent {
  @Output() closeHeatMap = new EventEmitter<void>();
  
  close() {
    this.closeHeatMap.emit();
  }

}

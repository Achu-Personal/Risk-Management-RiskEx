import { Component } from '@angular/core';
import { HeatmapComponent } from "../../Components/heatmap/heatmap.component";

@Component({
  selector: 'app-reference',
  standalone: true,
  imports: [HeatmapComponent],
  templateUrl: './reference.component.html',
  styleUrl: './reference.component.scss'
})
export class ReferenceComponent {

}

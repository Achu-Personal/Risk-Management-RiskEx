import { Component } from '@angular/core';
import { StyleButtonComponent } from "../../UI/style-button/style-button.component";

@Component({
  selector: 'app-wild-component',
  standalone: true,
  imports: [StyleButtonComponent],
  templateUrl: './wild-component.component.html',
  styleUrl: './wild-component.component.scss'
})
export class WildComponentComponent {
  goBack(): void {
    window.history.back();
  }
}

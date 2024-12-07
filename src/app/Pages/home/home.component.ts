import { Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { SearchboxComponent } from "../../UI/searchbox/searchbox.component";
import { ButtonComponent } from "../../UI/button/button.component";
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { DepartmentDropdownComponent } from "../../Components/department-dropdown/department-dropdown.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BodyContainerComponent, ButtonComponent, DepartmentDropdownComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
// data:any
// onDropdownChange($event: string) {
// }

}

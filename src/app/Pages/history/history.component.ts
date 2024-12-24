import { Component } from '@angular/core';
import { TableComponent } from "../../Components/table/table.component";
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { Router } from '@angular/router';
import { ButtonComponent } from "../../UI/button/button.component";

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [TableComponent, BodyContainerComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {

   constructor(private router: Router) {}

    OnClickRow(rowid:any): void {
      this.router.navigate([`/ViewRisk/${rowid}`]);
      console.log("rowdata",rowid);

    }
}

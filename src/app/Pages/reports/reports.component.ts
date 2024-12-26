import { Component } from '@angular/core';
import { TableComponent } from "../../Components/table/table.component";
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [TableComponent, BodyContainerComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {


     constructor(private router: Router) {}

      OnClickRow(rowid:any): void {
        this.router.navigate([`/ViewRisk/${rowid}`]);
        console.log("rowdata",rowid);

      }

}

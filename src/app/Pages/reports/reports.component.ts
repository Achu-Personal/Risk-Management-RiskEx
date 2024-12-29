import { Component } from '@angular/core';
import { TableComponent } from "../../Components/table/table.component";
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { Router } from '@angular/router';
import { StyleButtonComponent } from "../../UI/style-button/style-button.component";
import { DatepickerComponent } from "../../UI/datepicker/datepicker.component";

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [TableComponent, BodyContainerComponent, StyleButtonComponent, DatepickerComponent],
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

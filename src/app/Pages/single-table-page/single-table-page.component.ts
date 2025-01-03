import { Component, Input } from '@angular/core';
import { TableComponent } from "../../Components/table/table.component";
import { DatepickerComponent } from "../../UI/datepicker/datepicker.component";
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { ApiService } from '../../Services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-single-table-page',
  standalone: true,
  imports: [TableComponent, DatepickerComponent, BodyContainerComponent],
  templateUrl: './single-table-page.component.html',
  styleUrl: './single-table-page.component.scss'
})
export class SingleTablePageComponent {
 constructor(private router: Router,public api: ApiService) {}

    OnClickRow(rowid:any): void {
      this.router.navigate([`/ViewRisk/${rowid}`]);
      console.log("rowdata",rowid);

    }
    @Input() items:any=[];
    ngOnInit(): void {

      this.api.gethistorytabledata().subscribe((res: any) => {
        this.items = res;
        console.log(this.items);

      });

    }
}

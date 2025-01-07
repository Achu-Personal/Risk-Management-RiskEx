import { department } from './../../Interfaces/deparments.interface';
import { Component, Input } from '@angular/core';
import { TableComponent } from "../../Components/table/table.component";
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { Router } from '@angular/router';
import { ButtonComponent } from "../../UI/button/button.component";
import { DatepickerComponent } from "../../UI/datepicker/datepicker.component";
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';
import { firstValueFrom } from 'rxjs';
import { project } from '../../Interfaces/projects.interface';


@Component({
  selector: 'app-history',
  standalone: true,
  imports: [TableComponent, BodyContainerComponent, DatepickerComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {
  isAdmin: boolean = false;
  isDepartmentUser: boolean = false;
  @Input() items:any=[];

  constructor(private router: Router,public api: ApiService,public auth: AuthService) {}

    OnClickRow(rowid:any): void {
      this.router.navigate([`/ViewRisk/${rowid}`]);
      console.log("rowdata",rowid);

    }
    projectList: project[] = [];


    ngOnInit(): void {
    const role = this.auth.getUserRole();
    this.isAdmin = role === 'Admin';
    const department = this.auth.getDepartmentId();
    this.isDepartmentUser = role ==='DepartmentUser';
      // console.log( "sssss",this.auth.getProjects().)
  //   this.auth.getProjects().subscribe(
  //     (projects: project[]) => {
  //         this.projectList = projects;
  //         console.log("projids",this.projectList);
  //     },
  //     (error) => {
  //         console.error('Error loading projects:', error);
  //     }
  // )
    console.log("projids",this.projectList);
    console.log("dep",department);
    console.log("role",role);
    setTimeout(()=>{

    if(this.isAdmin){
      this.api.gethistorytabledata().subscribe((res: any) => {
        this.items = res;
        console.log(this.items);
      });

    }
    if(this.isDepartmentUser){
      this.api.getDepartmentHistoryTable(department).subscribe((res:any)=>{
        this.items = res;
        console.log("depart",this.items);
        if(this.projectList !=null){
          this.api.getProjectTable(this.projectList).subscribe((res:any)=>{
            this.items = res;
            console.log("pro",this.items);
          })
        }
      })
    }

  },1000);

    }

    //datepicker
    selectedDateRange: { startDate: string; endDate: string } | null = null;

    onDateRangeSelected(dateRange: { startDate: string; endDate: string }) {
    this.selectedDateRange = dateRange;
  }
}

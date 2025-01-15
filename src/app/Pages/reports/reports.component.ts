import { ChangeDetectorRef, Component, HostListener, Input } from '@angular/core';
import { TableComponent } from "../../Components/table/table.component";
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { Router } from '@angular/router';
import { StyleButtonComponent } from "../../UI/style-button/style-button.component";
import { DatepickerComponent } from "../../UI/datepicker/datepicker.component";
import { ReportGenerationService } from '../../Services/report-generation.service';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [TableComponent, BodyContainerComponent, StyleButtonComponent, DatepickerComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  isAdmin: boolean = false;
  isDepartmentUser: boolean = false;
  isProjectUser : boolean = false;
  isEmtUser:boolean =false;
  isLoading = false;
  projectList: number[] =[];
  item:any=[];
  @Input() label: string = 'Generate Report';
  // @Input() data?: any[]; // Optional input for custom data
  data:any;
  items:any=[];
  type: any;
  constructor(private excelService: ReportGenerationService,private router: Router,public api: ApiService,public auth: AuthService, private cdr: ChangeDetectorRef) {}

  filtereddata():void{

  }
  onGenerateReport(): void {
    console.log(this.filteredTableData);
    if (Array.isArray(this.filteredTableData) && this.filteredTableData.length > 0) {
      this.excelService.generateReport(this.filteredTableData, 'RiskReport');
    } else {
      console.error('Invalid data:', this.filteredTableData);
    }

    console.log('Data passed to generateReport:', this.filteredTableData);

  }

  filteredTableData: any[] = [];

  onFilteredData(filteredData: any[]): void {
    this.filteredTableData = filteredData;
    // this.items = [...filteredData];///
    // this.cdr.detectChanges();///
    console.log('Received filtered data:', this.filteredTableData);
  }

  isDropdownOpen: boolean = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;

  }

  @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
      const target = event.target as HTMLElement;
      if (!target.closest('.contains1')) {
        this.isDropdownOpen = false;
      }
    }

      OnClickRow(rowid:any): void {
        this.router.navigate([`/ViewRisk/${rowid}`]);
        console.log("rowdata",rowid);
      }

      ngOnInit(): void {
        this.type = history.state.type;
        console.log("history type:", this.type);

        setTimeout(() => {
          const role = this.auth.getUserRole();
          const department = this.auth.getDepartmentId();
          const pro = this.auth.getProjects();
          this.isLoading = true;

          // Set roles
          this.isAdmin = Array.isArray(role) ? role.includes('Admin') : role === 'Admin';
          this.isDepartmentUser = role === 'DepartmentUser';
          this.isProjectUser = Array.isArray(role) ? role.includes('ProjectUsers') : role === 'ProjectUsers';
          this.isEmtUser = Array.isArray(role) ? role.includes('EMTUser') : role ==="EMTUser";
          console.log("Roles: Admin:", this.isAdmin, "DepartmentUser:", this.isDepartmentUser, "ProjectUser:", this.isProjectUser,"EMTUser:", this.isEmtUser);

          // Prepare Project List
          this.projectList = pro ? pro.map((project) => project.Id) : [];
          console.log("Project List:", this.projectList);

          // Fetch data based on conditions
          this.fetchData(department);
          this.cdr.detectChanges();
        }, 50);
      }

      fetchData(department: any): void {

        if (this.type !== null && this.type !== undefined) {
          this.fetchFilteredData(department, this.type);
        } else {
          this.fetchAllData(department);
        }
      }

      fetchFilteredData(department: any, type: any): void {
        if (this.isAdmin ||this.isEmtUser) {
          this.api.gettabledata().subscribe((res: any) => {
            this.item = res.filter((item: { riskType: any }) => item.riskType === type);
            this.items =this.item.filter((item: { riskStatus: any }) => item.riskStatus === 'open');
            // this.onFilteredData(this.items);///
            this.cdr.detectChanges();
            this.isLoading = false;
            console.log("Admin Filtered Data:", this.items);
          });
        }
        if (this.isDepartmentUser) {
          this.api.getDepartmentTable(department).subscribe((res: any) => {
            this.item = res.filter((item: { riskType: any }) => item.riskType === type);
            this.items =this.item.filter((item: { riskStatus: any }) => item.riskStatus === 'open');
            this.cdr.detectChanges();
            this.isLoading = false;
            console.log("Department User Filtered Data:", this.items);
          });
        }
        if (this.isProjectUser) {
          this.api.getProjectTable(this.projectList).subscribe((res: any) => {
            this.item = res.filter((item: { riskType: any }) => item.riskType === type);
            this.items =this.item.filter((item: { riskStatus: any }) => item.riskStatus === 'open');
            this.cdr.detectChanges();
            this.isLoading = false;
            console.log("Project User Filtered Data:", this.items);
          });
        }
      }

      fetchAllData(department: any): void {
        if (this.isAdmin||this.isEmtUser) {
          this.api.gettabledata().subscribe((res: any) => {
            this.items = res;
            this.cdr.detectChanges();
            this.isLoading = false;
            console.log("Admin All Data:", this.items);
          });
        }
        if (this.isDepartmentUser) {
          this.api.getDepartmentTable(department).subscribe((res: any) => {
            this.items = res;
            this.cdr.detectChanges();
            this.isLoading = false;
            console.log("Department User All Data:", this.items);
          });
        }
        if (this.isProjectUser) {
          this.api.getProjectTable(this.projectList).subscribe((res: any) => {
            this.items = res;
            this.cdr.detectChanges();
            this.isLoading = false;
            console.log("Project User All Data:", this.items);
          });
        }
      }

      //datepicker
    selectedDateRange: { startDate: string; endDate: string } | null = null;

    onDateRangeSelected(dateRange: { startDate: string; endDate: string }) {
    this.selectedDateRange = dateRange;
}
}

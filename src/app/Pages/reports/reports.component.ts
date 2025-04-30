import { ChangeDetectorRef, Component, HostListener, Input } from '@angular/core';
import { TableComponent } from "../../Components/table/table.component";
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { Router } from '@angular/router';
import { StyleButtonComponent } from "../../UI/style-button/style-button.component";
import { DatepickerComponent } from "../../UI/datepicker/datepicker.component";
import { ReportGenerationService } from '../../Services/report-generation.service';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [TableComponent, BodyContainerComponent, StyleButtonComponent, DatepickerComponent, CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  isAdmin: boolean = false;
  isDepartmentUser: boolean = false;
  isProjectUser: boolean = false;
  isEmtUser: boolean = false;
  isLoading = false;
  projectList: number[] = [];
  item: any = [];
  isreset: boolean = false;
  @Input() label: string = 'Generate Report';
  data: any;
  items: any = [];
  type: any;
  constructor(private excelService: ReportGenerationService, private router: Router, public api: ApiService, public auth: AuthService, private cdr: ChangeDetectorRef) { }

  filtereddata(): void {

  }
  onGenerateReport(): void {
    if (Array.isArray(this.filteredTableData) && this.filteredTableData.length > 0) {
      this.excelService.generateReport(this.filteredTableData, 'RiskReport');
    } else {
      console.error('Invalid data:', this.filteredTableData);
    }
  }

  filteredTableData: any[] = [];

  onFilteredData(filteredData: any[]): void {
    this.filteredTableData = filteredData;
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

  OnClickRow(rowid: any): void {
    this.router.navigate([`/ViewRisk/${rowid}`]);
  }

  reset(): void {
    this.isreset = false;
    setTimeout(() => {
      this.isreset = true;
    });
  }


  ngOnInit(): void {
    this.type = history.state.type;

    setTimeout(() => {
      const role = this.auth.getUserRole();
      const department = this.auth.getDepartmentId();
      const pro = this.auth.getProjects();
      this.isLoading = true;

      // Set roles
      this.isAdmin = Array.isArray(role) ? role.includes('Admin') : role === 'Admin';
      this.isDepartmentUser = role === 'DepartmentUser';
      this.isProjectUser = Array.isArray(role) ? role.includes('ProjectUsers') : role === 'ProjectUsers';
      this.isEmtUser = Array.isArray(role) ? role.includes('EMTUser') : role === "EMTUser";

      // Prepare Project List
      this.projectList = pro ? pro.map((project) => project.Id) : [];

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
    if (this.isAdmin || this.isEmtUser) {
      this.api.gettabledata().subscribe((res: any) => {
        this.item = res.filter((item: { riskType: any }) => item.riskType === type);
        this.items = this.item.filter((item: { riskStatus: any }) => item.riskStatus === 'open');
        this.cdr.detectChanges();
        this.isLoading = false;
      });
    }
    if (this.isDepartmentUser) {
      this.api.getDepartmentTable(department).subscribe((res: any) => {
        this.item = res.filter((item: { riskType: any }) => item.riskType === type);
        this.items = this.item.filter((item: { riskStatus: any }) => item.riskStatus === 'open');
        this.cdr.detectChanges();
        this.isLoading = false;
      });
    }
    if (this.isProjectUser) {
      this.api.getProjectTable(this.projectList).subscribe((res: any) => {
        this.item = res.filter((item: { riskType: any }) => item.riskType === type);
        this.items = this.item.filter((item: { riskStatus: any }) => item.riskStatus === 'open');
        this.cdr.detectChanges();
        this.isLoading = false;
      });
    }
  }

  fetchAllData(department: any): void {
    if (this.isAdmin || this.isEmtUser) {
      this.api.gettabledata().subscribe((res: any) => {
        this.items = res;
        this.cdr.detectChanges();
        this.isLoading = false;
      });
    }
    if (this.isDepartmentUser) {
      this.api.getDepartmentTable(department).subscribe((res: any) => {
        this.items = res;
        this.cdr.detectChanges();
        this.isLoading = false;
      });
    }
    if (this.isProjectUser) {
      this.api.getProjectTable(this.projectList).subscribe((res: any) => {
        this.items = res;
        this.cdr.detectChanges();
        this.isLoading = false;
      });
    }
  }

  //datepicker
  selectedDateRange: { startDate: string; endDate: string } | null = null;

  onDateRangeSelected(dateRange: { startDate: string; endDate: string }) {
    this.selectedDateRange = dateRange;
  }
  Draft() {
    this.router.navigate(['/draft']);
  }
}

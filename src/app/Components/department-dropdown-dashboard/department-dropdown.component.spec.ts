// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { DepartmentDropdownComponent } from './department-dropdown.component';
// import { ApiService } from '../../Services/api.service';
// import { FormsModule } from '@angular/forms';
// import { of, throwError } from 'rxjs';

// const mockDepartments = [
//   { id: 1, departmentName: 'Engineering',departmentCode:'En' },
//   { id: 2, departmentName: 'Marketing',departmentCode:'mr' },
//   { id: 3, departmentName: 'Sales',departmentCode:'Sl' }
// ];

// class MockApiService {
//   getDepartment() {
//     return of(mockDepartments);
//   }
// }

// describe('DepartmentDropdownComponent', () => {
//   let component: DepartmentDropdownComponent;
//   let fixture: ComponentFixture<DepartmentDropdownComponent>;
//   let apiService: ApiService;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [FormsModule, DepartmentDropdownComponent],
//       providers: [{ provide: ApiService, useClass: MockApiService }]
//     }).compileComponents();

//     fixture = TestBed.createComponent(DepartmentDropdownComponent);
//     component = fixture.componentInstance;
//     apiService = TestBed.inject(ApiService);
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should load departments on init', fakeAsync(() => {
//     spyOn(apiService, 'getDepartment').and.callThrough();
//     component.ngOnInit();
//     tick();

//     expect(apiService.getDepartment).toHaveBeenCalled();
//     expect(component.dropdownOptions).toEqual(mockDepartments);
//   }));

//   it('should handle error when loading departments', fakeAsync(() => {
//     const errorMsg = 'API Error';
//     spyOn(apiService, 'getDepartment').and.returnValue(throwError(() => errorMsg));
//     spyOn(console, 'error');

//     component.ngOnInit();
//     tick();

//     expect(console.error).toHaveBeenCalledWith('Failed to fetch departments', errorMsg);
//   }));

//   it('should toggle dropdown', () => {
//     expect(component.dropdownOpen).toBeFalse();
//     component.toggleDropdown();
//     expect(component.dropdownOpen).toBeTrue();
//     component.toggleDropdown();
//     expect(component.dropdownOpen).toBeFalse();
//   });

//   it('should filter options based on search term', () => {
//     component.dropdownOptions = mockDepartments;
//     component.searchTerm = 'eng';

//     const filtered = component.filterOptions();
//     expect(filtered.length).toBe(1);
//     expect(filtered[0].departmentName).toBe('Engineering');
//   });

//   it('should toggle item selection', () => {
//     const item = mockDepartments[0];

//     component.toggleSelection(item);
//     expect(component.selectedItems).toContain(item);
//     expect(component.selectedDepartment).toBe('Engineering');

//     component.toggleSelection(item);
//     expect(component.selectedItems).not.toContain(item);
//     expect(component.selectedDepartment).toBe('Select Department');
//   });

//   it('should check if item is selected', () => {
//     const item = mockDepartments[0];
//     expect(component.isSelected(item)).toBeFalse();

//     component.selectedItems = [item];
//     expect(component.isSelected(item)).toBeTrue();
//   });

//   it('should handle select all toggle', () => {
//     component.dropdownOptions = mockDepartments;

//     component.selectAll();
//     expect(component.selectedItems.length).toBe(mockDepartments.length);
//     expect(component.selectedDepartment).toBe('Engineering, Marketing, Sales');

//     component.selectAll();
//     expect(component.selectedItems.length).toBe(0);
//     expect(component.selectedDepartment).toBe('Select Department');
//   });

//   it('should check if all items are selected', () => {
//     component.dropdownOptions = mockDepartments;
//     expect(component.isAllSelected()).toBeFalse();

//     component.selectedItems = [...mockDepartments];
//     expect(component.isAllSelected()).toBeTrue();
//   });

//   it('should update selected department text', () => {
//     component.selectedItems = [mockDepartments[0], mockDepartments[1]];
//     component.updateSelectedDepartment();
//     expect(component.selectedDepartment).toBe('Engineering, Marketing');
//   });

//   it('should log when passing to other component', () => {
//     spyOn(console, 'log');
//     component.selectedItems = [mockDepartments[0]];

//     component.passToOtherComponent();
//     expect(console.log).toHaveBeenCalledWith(
//       'Passing selected departments to another component:',
//       [mockDepartments[0]]
//     );
//   });
// });

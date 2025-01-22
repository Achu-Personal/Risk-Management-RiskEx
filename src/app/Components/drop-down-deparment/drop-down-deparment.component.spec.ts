// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { DropDownDeparmentComponent } from './drop-down-deparment.component';
// import { ApiService } from '../../Services/api.service';
// import { ElementRef } from '@angular/core';
// import { of, Subject, throwError } from 'rxjs';
// import { department } from '../../Interfaces/deparments.interface';

// describe('DropDownDeparmentComponent', () => {
//   let component: DropDownDeparmentComponent;
//   let fixture: ComponentFixture<DropDownDeparmentComponent>;
//   let apiServiceSpy: jasmine.SpyObj<ApiService>;
//   let departmentUpdateSubject: Subject<void>;

//   const mockDepartments: department[] = [
//     { id: 1, departmentName: 'Engineering',departmentCode:'En' },
//     { id: 2, departmentName: 'Marketing',departmentCode:'Mr' },
//     { id: 3, departmentName: 'Human Resources',departmentCode:'HR' }
//   ];

//   beforeEach(async () => {
//     departmentUpdateSubject = new Subject<void>();
//     apiServiceSpy = jasmine.createSpyObj('ApiService', ['getDepartment'], {
//       departmentUpdate$: departmentUpdateSubject.asObservable()
//     });

//     await TestBed.configureTestingModule({
//       imports: [DropDownDeparmentComponent],
//       providers: [
//         { provide: ApiService, useValue: apiServiceSpy },
//         { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } }
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(DropDownDeparmentComponent);
//     component = fixture.componentInstance;
//   });

//   // Initial State Tests
//   describe('Initial State', () => {
//     it('should create', () => {
//       expect(component).toBeTruthy();
//     });

//     it('should initialize with default values', () => {
//       expect(component.departments).toEqual([]);
//       expect(component.filteredDepartments).toEqual([]);
//       expect(component.selectedDepartment).toBe('');
//       expect(component.searchText).toBe('');
//       expect(component.disabled).toBeFalse();
//       expect(component.dropdownOpen).toBeFalse();
//     });
//   });

//   // Department Loading Tests
//   describe('Department Loading', () => {
//     it('should load and sort departments on init', fakeAsync(() => {
//       apiServiceSpy.getDepartment.and.returnValue(of(mockDepartments));
//       component.ngOnInit();
//       tick();

//       expect(component.departments).toEqual(mockDepartments);
//       expect(component.filteredDepartments).toEqual(mockDepartments);
//     }));

//     it('should handle error when loading departments', fakeAsync(() => {
//       apiServiceSpy.getDepartment.and.returnValue(throwError(() => new Error('API Error')));
//       component.ngOnInit();
//       tick();

//       expect(component.departments).toEqual([]);
//       expect(component.filteredDepartments).toEqual([]);
//     }));

//     it('should reload departments when department update event is received', fakeAsync(() => {
//       apiServiceSpy.getDepartment.and.returnValue(of(mockDepartments));
//       component.ngOnInit();
//       tick();

//       const updatedDepartments = [...mockDepartments, { id: 4, departmentName: 'Finance',departmentCode:'Fi' }];
//       apiServiceSpy.getDepartment.and.returnValue(of(updatedDepartments));
//       departmentUpdateSubject.next();
//       tick();

//       expect(component.departments).toEqual(updatedDepartments);
//     }));
//   });

//   // Search/Filter Tests
//   describe('Department Filtering', () => {
//     beforeEach(() => {
//       component.departments = mockDepartments;
//       component.filteredDepartments = [...mockDepartments];
//     });

//     it('should filter departments based on search text', () => {
//       const event = new InputEvent('input', {
//         bubbles: true,
//         cancelable: true,
//       });
//       Object.defineProperty(event, 'target', {
//         value: { value: 'eng' } as HTMLInputElement,
//         writable: false
//       });

//       component.filterDepartments(event);
//       expect(component.filteredDepartments.length).toBe(1);
//       expect(component.filteredDepartments[0].departmentName).toBe('Engineering');
//     });

//     it('should show all departments when search text is empty', () => {
//       const event = new InputEvent('input', {
//         bubbles: true,
//         cancelable: true,
//       });
//       Object.defineProperty(event, 'target', {
//         value: { value: '' } as HTMLInputElement,
//         writable: false
//       });

//       component.filterDepartments(event);
//       expect(component.filteredDepartments).toEqual(mockDepartments);
//     });

//     it('should show no results when search text matches nothing', () => {
//       const event = new InputEvent('input', {
//         bubbles: true,
//         cancelable: true,
//       });
//       Object.defineProperty(event, 'target', {
//         value: { value: 'xyz123' } as HTMLInputElement,
//         writable: false
//       });

//       component.filterDepartments(event);
//       expect(component.filteredDepartments.length).toBe(0);
//     });
//   });

//   // Selection Tests
//   describe('Department Selection', () => {
//     it('should select department and emit event', () => {
//       spyOn(component.departmentSelected, 'emit');
//       const department = mockDepartments[0];

//       component.selectDepartment(department);

//       expect(component.selectedDepartment).toBe(department.departmentName);
//       expect(component.departmentSelected.emit).toHaveBeenCalledWith(department);
//       expect(component.dropdownOpen).toBeFalse();
//     });

//     it('should not select department when disabled', () => {
//       spyOn(component.departmentSelected, 'emit');
//       component.disabled = true;
//       const department = mockDepartments[0];

//       component.selectDepartment(department);

//       expect(component.selectedDepartment).not.toBe(department.departmentName);
//       expect(component.departmentSelected.emit).not.toHaveBeenCalled();
//     });
//   });

//   // Dropdown UI Tests
//   describe('Dropdown UI Behavior', () => {
//     it('should toggle dropdown when clicked', () => {
//       component.toggleDropdown();
//       expect(component.dropdownOpen).toBeTrue();

//       component.toggleDropdown();
//       expect(component.dropdownOpen).toBeFalse();
//     });

//     it('should not toggle dropdown when disabled', () => {
//       component.disabled = true;
//       component.toggleDropdown();
//       expect(component.dropdownOpen).toBeFalse();
//     });

//     it('should close dropdown when clicking outside', () => {
//       component.dropdownOpen = true;
//       const event = new MouseEvent('click');
//       component.onDocumentClick(event);
//       expect(component.dropdownOpen).toBeFalse();
//     });
//   });

//   // ControlValueAccessor Tests
//   describe('ControlValueAccessor Implementation', () => {
//     it('should implement writeValue', () => {
//       component.writeValue('Engineering');
//       expect(component.selectedDepartment).toBe('Engineering');

//       component.writeValue('');
//       expect(component.selectedDepartment).toBe('');
//     });

//     it('should implement registerOnChange', () => {
//       const mockFn = jasmine.createSpy('mockFn');
//       component.registerOnChange(mockFn);
//       const department = mockDepartments[0];
//       component.selectDepartment(department);
//       expect(mockFn).toHaveBeenCalledWith(department.departmentName);
//     });

//     it('should implement setDisabledState', () => {
//       component.setDisabledState(true);
//       expect(component.disabled).toBeTrue();

//       component.setDisabledState(false);
//       expect(component.disabled).toBeFalse();
//     });
//   });
// });

// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { ProjectDropDownComponent } from './project-drop-down.component';
// import { ApiService } from '../../Services/api.service';
// import { AuthService } from '../../Services/auth.service';
// import { of, throwError } from 'rxjs';
// import { project } from '../../Interfaces/projects.interface';

// describe('ProjectDropDownComponent', () => {
//   let component: ProjectDropDownComponent;
//   let fixture: ComponentFixture<ProjectDropDownComponent>;
//   let apiServiceSpy: jasmine.SpyObj<ApiService>;
//   let authServiceSpy: jasmine.SpyObj<AuthService>;

//   const mockProjects: project[] = [
//     { id: 1, name: 'Project 1', projectCode: 'P1' },
//     { id: 2, name: 'Project 2', projectCode: 'P2' },
//     { id: 3, name: 'Project 3', projectCode: 'P3' }
//   ];

//   beforeEach(async () => {
//     apiServiceSpy = jasmine.createSpyObj('ApiService', ['getProjects']);
//     authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserRole']);

//     await TestBed.configureTestingModule({
//       imports: [ProjectDropDownComponent],
//       providers: [
//         { provide: ApiService, useValue: apiServiceSpy },
//         { provide: AuthService, useValue: authServiceSpy }
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(ProjectDropDownComponent);
//     component = fixture.componentInstance;
//   });

//   // Initial State Tests
//   describe('Initial State', () => {
//     it('should create', () => {
//       expect(component).toBeTruthy();
//     });

//     it('should initialize with default values', () => {
//       expect(component.departmentName).toBe('');
//       expect(component.dropdownOpen).toBeFalse();
//       expect(component.selectedItems).toEqual([]);
//       expect(component.selectedProject).toBe('Select Projects');
//       expect(component.filteredProjects).toEqual([]);
//       expect(component.disabled).toBeFalse();
//       expect(component.loading).toBeFalse();
//     });
//   });

//   // Project Loading Tests
//   describe('Project Loading', () => {
//     it('should load projects when department name changes', fakeAsync(() => {
//       apiServiceSpy.getProjects.and.returnValue(of(mockProjects));
//       component.departmentName = 'IT';

//       component.ngOnChanges({
//         departmentName: {
//           currentValue: 'IT',
//           previousValue: '',
//           firstChange: true,
//           isFirstChange: () => true
//         }
//       });

//       tick();

//       expect(component.filteredProjects).toEqual(mockProjects);
//       expect(component.loading).toBeFalse();
//     }));

//     it('should handle error when loading projects fails', fakeAsync(() => {
//       apiServiceSpy.getProjects.and.returnValue(throwError(() => new Error('API Error')));
//       component.departmentName = 'IT';

//       component.ngOnChanges({
//         departmentName: {
//           currentValue: 'IT',
//           previousValue: '',
//           firstChange: true,
//           isFirstChange: () => true
//         }
//       });

//       tick();

//       expect(component.filteredProjects).toEqual([]);
//       expect(component.loading).toBeFalse();
//     }));
//   });




//   // ControlValueAccessor Tests
//   describe('ControlValueAccessor Implementation', () => {
//     it('should implement writeValue', () => {
//       const selectedProjects = [mockProjects[0]];
//       component.writeValue(selectedProjects);
//       expect(component.selectedItems).toEqual(selectedProjects);
//       expect(component.selectedProject).toBe(mockProjects[0].name);
//     });

//     it('should implement registerOnChange', () => {
//       const mockFn = jasmine.createSpy('mockFn');
//       component.registerOnChange(mockFn);
//       component.toggleSelection(mockProjects[0]);
//       expect(mockFn).toHaveBeenCalled();
//     });

//     it('should implement setDisabledState', () => {
//       component.setDisabledState(true);
//       expect(component.disabled).toBeTrue();
//     });
//   });

//   // Click Outside Tests
//   describe('Click Outside Behavior', () => {
//     it('should close dropdown when clicking outside', () => {
//       // Mock document.querySelector
//       spyOn(document, 'querySelector').and.returnValue({
//         contains: () => false
//       } as any);

//       component.dropdownOpen = true;
//       component.onClickOutside(new MouseEvent('click'));
//       expect(component.dropdownOpen).toBeFalse();
//     });

//     it('should keep dropdown open when clicking inside', () => {
//       // Mock document.querySelector
//       spyOn(document, 'querySelector').and.returnValue({
//         contains: () => true
//       } as any);

//       component.dropdownOpen = true;
//       component.onClickOutside(new MouseEvent('click'));
//       expect(component.dropdownOpen).toBeTrue();
//     });
//   });
// });

// import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
// import { UsersComponent } from './users.component';
// import { ApiService } from '../../Services/api.service';
// import { ReactiveFormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';
// import { of, throwError } from 'rxjs';

// class MockApiService {
//   getProjects(department: string) {
//     return of([{ name: 'Project 1' }, { name: 'Project 2' }]);
//   }

//   getDepartment() {
//     return of([{ name: 'Engineering' }, { name: 'Marketing' }]);
//   }

//   addNewDepartment(departmentData: any) {
//     return of({ message: 'Department added successfully' });
//   }

//   addNewProject(projectData: any) {
//     return of({ message: 'Project added successfully' });
//   }

//   addNewUser(userData: any) {
//     return of({ message: 'User added successfully' });
//   }
// }

// describe('UsersComponent', () => {
//   let component: UsersComponent;
//   let fixture: ComponentFixture<UsersComponent>;
//   let apiService: ApiService;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [
//         ReactiveFormsModule,
//         HttpClientModule,
//         UsersComponent,
//       ],
//       providers: [{ provide: ApiService, useClass: MockApiService }],
//     }).compileComponents();

//     fixture = TestBed.createComponent(UsersComponent);
//     component = fixture.componentInstance;
//     apiService = TestBed.inject(ApiService);
//     fixture.detectChanges();
//   });

//   it('should create the UsersComponent', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should load projects when a department is selected', fakeAsync(() => {
//     const department = 'Engineering';
//     spyOn(apiService, 'getProjects').and.callThrough();

//     component.userForm.get('department')?.setValue(department);
//     tick();

//     expect(apiService.getProjects).toHaveBeenCalledWith(department);
//     expect(component.projects.length).toBe(2);
//   }));



//   it('should handle API errors gracefully during department form submission', fakeAsync(() => {
//     const errorMessage = 'API Error';
//     spyOn(apiService, 'addNewDepartment').and.returnValue(throwError(() => ({ error: { message: errorMessage } })));
//     spyOn(window, 'alert');

//     component.departmentForm.patchValue({ name: 'Test Department' ,departmentCode:'TD'});
//     component.onSubmitDepartment();
//     tick();

//     expect(component.departmentForm.valid).toBeTrue();
//     expect(window.alert).toHaveBeenCalledWith(errorMessage);
//   }));

//   it('should call addNewDepartment API when the form is valid', fakeAsync(() => {
//     const departmentData = { name: 'Marketing',departmentCode:'MR' };
//     spyOn(apiService, 'addNewDepartment').and.callThrough();

//     component.departmentForm.patchValue(departmentData);
//     component.onSubmitDepartment();
//     tick();

//     expect(apiService.addNewDepartment).toHaveBeenCalledWith(departmentData);
//     expect(component.departmentForm.valid).toBeTrue();
//   }));

//   it('should close modal when department is successfully added', fakeAsync(() => {
//     const departmentData = { name: 'Marketing' ,departmentCode:'MR'};
//     const mockElement = { click: jasmine.createSpy() };

//     spyOn(apiService, 'addNewDepartment').and.callThrough();
//     spyOn(document, 'getElementById').and.returnValue(mockElement as any);

//     component.departmentForm.patchValue(departmentData);
//     component.onSubmitDepartment();
//     tick();

//     expect(document.getElementById).toHaveBeenCalledWith('addDepartmentModal');
//     expect(mockElement.click).toHaveBeenCalled();
//   }));

//   it('should reset the form after project submission', fakeAsync(() => {
//     const projectData = {
//       projectName: 'New Project',
//       departmentName: 'Engineering',
//       projectCode:'np'
//     };

//     spyOn(apiService, 'addNewProject').and.callThrough();

//     component.projectForm.patchValue(projectData);
//     component.onSubmitProject();
//     tick();

//     expect(component.projectForm.value).toEqual({
//       projectName: '',
//       departmentName: '',
//       projectCode:''
//     });
//     expect(apiService.addNewProject).toHaveBeenCalledWith(projectData);
//   }));

//   it('should handle invalid department form submission', fakeAsync(() => {
//     spyOn(apiService, 'addNewDepartment');

//     component.departmentForm.get('name')?.setValue('');
//     component.onSubmitDepartment();
//     tick();

//     expect(component.departmentForm.invalid).toBeTrue();
//     expect(apiService.addNewDepartment).not.toHaveBeenCalled();
//   }));
// });

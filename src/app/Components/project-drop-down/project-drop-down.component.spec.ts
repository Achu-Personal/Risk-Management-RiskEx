import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ProjectDropDownComponent } from './project-drop-down.component';
import { ApiService } from '../../Services/api.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { project } from '../../Interfaces/projects.interface';
import { lastValueFrom } from 'rxjs';


describe('ProjectDropDownComponent', () => {
  let component: ProjectDropDownComponent;
  let fixture: ComponentFixture<ProjectDropDownComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', ['getProjects']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule],
      providers: [{ provide: ApiService, useValue: apiService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    apiService.getProjects.calls.reset();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.departmentName).toBe('');
    expect(component.filteredProjects).toEqual([]);
    expect(component.selectedItems).toEqual([]);
    expect(component.selectedProject).toBe('Select Projects');
    expect(component.loading).toBe(false);
    expect(component.dropdownOpen).toBe(false);
  });


// it('should load projects when departmentName changes', fakeAsync(async () => { // async is now needed
//     const mockProjects: project[] = [
//       { id: 1, name: 'Project 1' },
//       { id: 2, name: 'Project 2' },
//     ];

//     apiService.getProjects.and.returnValue(of(mockProjects));

//     component.departmentName = 'Engineering';
//     fixture.detectChanges();

//     component.ngOnChanges({
//       departmentName: {
//         currentValue: 'Engineering',
//         firstChange: true,
//         previousValue: '',
//         isFirstChange: () => true,
//       },
//     });

//     expect(component.loading).toBe(true);

//     await lastValueFrom(apiService.getProjects('Engineering')); // Await the observable completion

//     tick(); // tick is still important for other timing related things but not for the observable resolution itself

//     fixture.detectChanges();
//     expect(component.loading).toBe(false);
//     expect(apiService.getProjects).toHaveBeenCalledWith('Engineering');
//     expect(component.filteredProjects).toEqual(mockProjects);
//     expect(component.selectedItems).toEqual([]);
//     expect(component.selectedProject).toBe('Select Projects');
//   }));



  it('should handle API errors when fetching projects', () => {
    apiService.getProjects.and.returnValue(
      throwError({ error: { message: 'Failed to load projects' } })
    );

    component.departmentName = 'Engineering';
    component.ngOnChanges({
      departmentName: {
        currentValue: 'Engineering',
        firstChange: true,
        previousValue: '',
        isFirstChange: function (): boolean {
          throw new Error('Function not implemented.');
        },
      },
    });

    expect(component.loading).toBe(false);
    expect(component.filteredProjects).toEqual([]);
    expect(component.selectedItems).toEqual([]);
    expect(component.selectedProject).toBe('Select Projects');
  });

  it('should toggle dropdown visibility', () => {
    component.filteredProjects = [{ id: 1, name: 'Project 1' }];
    component.disabled = false;

    expect(component.dropdownOpen).toBe(false);

    component.toggleDropdown();
    expect(component.dropdownOpen).toBe(true);

    component.toggleDropdown();
    expect(component.dropdownOpen).toBe(false);
  });

  it('should select and deselect projects', () => {
    const mockProjects: project[] = [
      { id: 1, name: 'Project 1' },
      { id: 2, name: 'Project 2' },
    ];

    component.filteredProjects = mockProjects;
    component.selectedItems = [];

    component.toggleSelection(mockProjects[0]);
    expect(component.selectedItems).toEqual([mockProjects[0]]);
    expect(component.selectedProject).toBe('Project 1');

    component.toggleSelection(mockProjects[0]);
    expect(component.selectedItems).toEqual([]);
    expect(component.selectedProject).toBe('Select Projects');
  });

  it('should select and deselect all projects', () => {
    const mockProjects: project[] = [
      { id: 1, name: 'Project 1' },
      { id: 2, name: 'Project 2' },
    ];

    component.filteredProjects = mockProjects;
    component.selectedItems = [];

    component.selectAll();
    expect(component.selectedItems).toEqual(mockProjects);
    expect(component.selectedProject).toBe('Project 1, Project 2');

    component.selectAll();
    expect(component.selectedItems).toEqual([]);
    expect(component.selectedProject).toBe('Select Projects');
  });

  it('should implement ControlValueAccessor methods', () => {
    const mockProjects: project[] = [
      { id: 1, name: 'Project 1' },
      { id: 2, name: 'Project 2' },
    ];

    component.writeValue(mockProjects);
    expect(component.selectedItems).toEqual(mockProjects);
    expect(component.selectedProject).toBe('Project 1, Project 2');

    const fn = jasmine.createSpy();
    component.registerOnChange(fn);

    component.toggleSelection(mockProjects[0]);

    expect(fn).toHaveBeenCalled();     expect(fn).toHaveBeenCalledWith(component.selectedItems);

    component.writeValue([]);
    expect(component.selectedItems).toEqual([]);
    expect(component.selectedProject).toBe('Select Projects');
});

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);

    component.setDisabledState(false);
    expect(component.disabled).toBe(false);
  });
});

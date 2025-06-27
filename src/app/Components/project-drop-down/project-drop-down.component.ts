import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { project } from '../../Interfaces/projects.interface';
import { AuthService } from '../../Services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-drop-down',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './project-drop-down.component.html',
  styleUrl: './project-drop-down.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProjectDropDownComponent),
      multi: true,
    },
  ],
})
export class ProjectDropDownComponent
  implements OnChanges, ControlValueAccessor
{
  @Input() departmentName: string = '';
  @Output() selectedProjectsChange = new EventEmitter<project[]>();

  dropdownOpen = false;
  selectedItems: project[] = [];
  selectedProject: string = 'Select Projects';
  filteredProjects: project[] = [];
  disabled = false;
  loading = false;
  private subscription: Subscription = new Subscription();

  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private api: ApiService, public authService: AuthService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['departmentName'] && this.departmentName) {
      const currentSelections = [...this.selectedItems];

      this.loading = true;
      this.api.getProjects(this.departmentName).subscribe(
        (response: project[]) => {
          this.filteredProjects = response;
          this.loading = false;

          const formValue = this.onChange.value;
          if (formValue && Array.isArray(formValue) && formValue.length > 0) {
            this.restoreSelections(formValue);
          } else if (currentSelections.length > 0) {
            this.restoreSelections(currentSelections);
          }

          this.updateSelectedProject();
          this.emitChanges();
        },
        (error) => {
          console.error('Failed to fetch projects for Department', error);
          this.resetComponent();
        }
      );
    } else if (!this.departmentName) {
      this.resetComponent();
    }
  }

  private restoreSelections(projects: any[]) {
    this.selectedItems = [];

    projects.forEach((project) => {
      let projectId;

      if (typeof project === 'object' && project !== null) {
        projectId = project.id;
      } else if (typeof project === 'string' || typeof project === 'number') {
        projectId = project;
      }

      if (projectId) {
        const matchingProject = this.filteredProjects.find(
          (p) => p.id === projectId
        );
        if (matchingProject) {
          this.selectedItems.push(matchingProject);
        }
      }
    });
  }

  private resetComponent() {
    this.filteredProjects = [];
    this.selectedItems = [];
    this.dropdownOpen = false;
    this.loading = false;
    this.updateSelectedProject();
    this.emitChanges();
  }
  ngOnInit() {
    // this.loadProjectsForDepartment();

    this.subscription.add(
      this.api.projectUpdate$.subscribe(() => {
        this.loadProjectsForDepartment();
      })
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadProjectsForDepartment() {
    this.loading = true;
    this.dropdownOpen = false;

    this.api.getProjects(this.departmentName).subscribe(
      (response: project[]) => {
        this.filteredProjects = response;
        this.selectedItems = [];
        this.updateSelectedProject();
        this.emitChanges();
        this.loading = false;
        // console.log('Projects fetched successfully for Department:', this.filteredProjects);
      },
      (error) => {
        console.error('Failed to fetch projects for Department', error);
        this.resetComponent();
      }
    );
  }

  toggleDropdown() {
    if (!this.disabled && this.filteredProjects.length > 0) {
      this.dropdownOpen = !this.dropdownOpen;
      if (this.dropdownOpen) {
        this.onTouched();
      }
    }
  }

  toggleSelection(item: project) {
    const index = this.selectedItems.findIndex(
      (selected) => selected.id === item.id
    );

    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item);
    }
    this.updateSelectedProject();
    this.emitChanges();
  }

  isSelected(item: project) {
    return this.selectedItems.some((selected) => selected.id === item.id);
  }

  selectAll() {
    if (this.selectedItems.length === this.filteredProjects.length) {
      this.selectedItems = [];
    } else {
      this.selectedItems = [...this.filteredProjects];
    }
    this.updateSelectedProject();
    this.emitChanges();
  }

  isAllSelected() {
    return (
      this.selectedItems.length === this.filteredProjects.length &&
      this.filteredProjects.length > 0
    );
  }

  updateSelectedProject() {
    if (this.selectedItems.length > 0) {
      this.selectedProject = this.selectedItems
        .map((proj) => proj.name)
        .join(', ');
    } else {
      this.selectedProject = 'Select Projects';
    }
  }

  private emitChanges() {
    this.selectedProjectsChange.emit(this.selectedItems);
    this.onChange(this.selectedItems);
  }

  writeValue(value: project[]): void {

    if (value && Array.isArray(value)) {
      const originalProjects = [...value];

      this.selectedItems = [];

      originalProjects.forEach((project) => {
        if (typeof project === 'object' && project.id) {
          const existingProject = this.filteredProjects.find(
            (p) => p.id === project.id
          );
          if (existingProject) {
            this.selectedItems.push(existingProject);
          } else {
            this.selectedItems.push(project);
          }
        } else if (typeof project === 'string' || typeof project === 'number') {
          const foundProject = this.filteredProjects.find(
            (p) => p.name === project
          );
          if (foundProject) {
            this.selectedItems.push(foundProject);
          }
        }
      });
      this.updateSelectedProject();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const dropdown = document.querySelector('.dropdown-content');
    if (dropdown && !dropdown.contains(event.target as Node)) {
      this.dropdownOpen = false;
    }
  }
}

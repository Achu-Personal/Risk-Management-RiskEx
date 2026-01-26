import { department } from './../../Interfaces/deparments.interface';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BodyContainerComponent } from '../../Components/body-container/body-container.component';
import { ApiService } from '../../Services/api.service';
import { ReusableTableComponent } from '../../Components/reusable-table/reusable-table.component';

import { ProjectDropDownComponent } from '../../Components/project-drop-down/project-drop-down.component';
import { project } from '../../Interfaces/projects.interface';
import { DropDownDeparmentComponent } from '../../Components/drop-down-deparment/drop-down-deparment.component';
import { StyleButtonComponent } from '../../UI/style-button/style-button.component';
import { NgIf } from '@angular/common';
import { AuthService } from '../../Services/auth/auth.service';
import { SingleProjectDropdownComponent } from '../../Components/single-project-dropdown/single-project-dropdown.component';
import { UsermanagementpopupComponent } from '../../Components/usermanagementpopup/usermanagementpopup.component';
import { EmailService } from '../../Services/email.service';
import { FormLoaderComponent } from '../../Components/form-loader/form-loader.component';
import { FormConformPopupComponent } from '../../Components/form-conform-popup/form-conform-popup.component';
import { FormSuccessfullComponent } from '../../Components/form-successfull/form-successfull.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BodyContainerComponent,
    ReusableTableComponent,
    ProjectDropDownComponent,
    DropDownDeparmentComponent,
    StyleButtonComponent,
    NgIf,
    SingleProjectDropdownComponent,
    UsermanagementpopupComponent,
    FormLoaderComponent,
    FormConformPopupComponent,
    FormSuccessfullComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  @ViewChild(UsermanagementpopupComponent)
  confirmationPopup!: UsermanagementpopupComponent;
  departments: department[] = [];
  projects: any[] = [];
  isDepartmentFieldDisabled = false;
  isAdmin: boolean = false;
  id: any;
  isLoading = true;
  confirmationMessage: string = '';
  isLoader = false;
  userPopupShow: boolean = false;
  isUserSuccess: boolean = false;
  isUserFail: boolean = false;

  headerData: string[] = [];
  headerDataDpt: string[] = ['fullName', 'email', 'department', 'projects'];
  headerDisplayMap: { [key: string]: string } = {
    fullName: 'Name',
    email: 'Email Id',
    department: 'Department',
    projects: 'Projects',
  };
  tableBodyAdmin: any[] = [
    {
      fullName: '',
      email: '',
      department: '',
      projects: '',
    },
  ];
  tableBody: any[] = [
    {
      fullName: '',
      email: '',
      department: '',
      projects: [],
    },
  ];
  userForm: FormGroup;
  departmentForm: FormGroup;
  projectForm: FormGroup;
  updateDepartmentForm: FormGroup;
  updateProjectForm: FormGroup;
  departmentProjects: any[] = [];

  editUserForm: FormGroup;

  constructor(
    public api: ApiService,
    public authService: AuthService,
    public emailService: EmailService,
    private fb: FormBuilder
  ) {
    this.departmentForm = new FormGroup({
      name: new FormControl('', Validators.required),
      departmentCode: new FormControl('', Validators.required),
    });
    this.userForm = new FormGroup({
      fullName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      departmentName: new FormControl('', Validators.required),
      projectIds: new FormControl([[]]),
    });
    this.projectForm = new FormGroup({
      projectName: new FormControl('', Validators.required),
      departmentName: new FormControl('', Validators.required),
      projectCode: new FormControl('', Validators.required),
    });
    this.updateDepartmentForm = new FormGroup({
      departmentName: new FormControl('', Validators.required),
      newDepartmentName: new FormControl('', Validators.required),
      newDepartmentCode: new FormControl('', Validators.required),
    });

    this.updateProjectForm = new FormGroup({
      selectedDepartment: new FormControl('', Validators.required),
      projectName: new FormControl('', Validators.required),
      newProjectName: new FormControl('', Validators.required),
      newProjectCode: new FormControl('', Validators.required),
    });

    this.editUserForm = this.fb.group({
      id: [''],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      departmentName: ['', Validators.required],
      projectIds: [[]],
    });
  }

  confirmationCallback: () => void = () => { };

  handleModalComplete() {
    this.refreshUsersData();
  }
  private normalizeWhitespace(value: string): string {
    return value?.trim() || '';
  }

  private refreshUsersData() {
    this.isLoading = true;
    const userRole = this.authService.getUserRole();
    if (userRole === 'Admin' || userRole?.includes('EMTUser')) {
      this.api.getAllUsers().subscribe({
        next: (users: any) => {

          const sortedUsers = [...users].sort((a: any, b: any) => {
            return a.fullName.toLowerCase().localeCompare(b.fullName.toLowerCase());
          });
          this.tableBodyAdmin = sortedUsers.reverse();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
          this.isLoading = false;
        },
      });
    } else if (userRole === 'DepartmentUser') {
      const department: any = this.authService.getDepartmentName();
      if (department) {
        this.api.getAllUsersByDepartmentName(department).subscribe({
          next: (users: any) => {
            const sortedUsers = [...users].sort((a: any, b: any) => {
              return a.fullName.toLowerCase().localeCompare(b.fullName.toLowerCase());
            });
            this.tableBody = sortedUsers.reverse();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error fetching department users:', error);
            this.isLoading = false;
          },
        });
      }
    } else if (userRole?.includes('ProjectUsers')) {
      this.api.getUsersByProjects().subscribe({
        next: (users) => {
          const sortedUsers = [...users].sort((a: any, b: any) => {
            return a.fullName.toLowerCase().localeCompare(b.fullName.toLowerCase());
          });
          this.tableBody = sortedUsers.reverse();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching project users:', error);
          this.isLoading = false;
        },
      });
    }
  }

  private loadDepartments() {
    this.isLoading = true;
    this.api.getDepartment().subscribe({
      next: (departments: department[]) => {
        this.departments = departments;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.isLoading = false;
      },
    });
  }
  resetUserForm() {
    this.userForm.reset();

    const userRole = this.authService.getUserRole();
    const userDepartment = this.authService.getDepartmentName();

    if (userRole === 'DepartmentUser' || userRole?.includes('ProjectUsers')) {
      this.userForm.patchValue({
        departmentName: userDepartment,
      });
      this.userForm.get('departmentName')?.disable();
    }
  }

  ngOnInit() {
    const userRole = this.authService.getUserRole();
    const userDepartment = this.authService.getDepartmentName();

    if (userRole === 'DepartmentUser' || userRole?.includes('ProjectUsers')) {
      this.userForm.patchValue({ departmentName: userDepartment });
      this.projectForm.patchValue({ departmentName: userDepartment });
      this.updateProjectForm.patchValue({ selectedDepartment: userDepartment });

      this.userForm.get('departmentName')?.disable();
      this.projectForm.get('departmentName')?.disable();
      this.updateProjectForm.get('selectedDepartment')?.disable();
      this.editUserForm.get('departmentName')?.disable();
      this.isDepartmentFieldDisabled = true;
    }

    if (userRole === 'Admin' || userRole?.includes('EMTUser')) {
      this.headerData = ['fullName', 'email', 'department', 'projects'];
      this.isAdmin = true;
      this.refreshUsersData();
    } else if (userRole === 'DepartmentUser') {
      this.isAdmin = false;
      this.refreshUsersData();
    } else if (userRole?.includes('ProjectUsers')) {
      this.refreshUsersData();
    }

    this.userForm
      .get('departmentName')
      ?.valueChanges.subscribe((selectedDepartment) => {
        if (selectedDepartment) {
          this.loadProjectsForDepartment(selectedDepartment);
        }
      });

    this.loadDepartments();


    const departmentControl = this.editUserForm.get('departmentName');
    if (departmentControl) {
      departmentControl.valueChanges.subscribe((value) => {
        if (value) {
          this.onDepartmentChange();
        }
      });
    }
  }

  loadProjectsForDepartment(department: string) {
    const normalizedDepartment = this.normalizeWhitespace(department);
    this.api.getProjects(normalizedDepartment).subscribe(
      (res) => {
        if (res && res.length > 0) {
          this.projects = res;

          if (this.editUserForm) {
            const selectedProjectIds =
              this.editUserForm.get('projectIds')?.value || [];

            const ids = selectedProjectIds.map((p: any) =>
              typeof p === 'object' && p.id ? p.id : p
            );

            const selectedProjects = this.projects.filter((p: any) =>
              ids.includes(p.id)
            );

            if (selectedProjects.length > 0) {
              this.editUserForm.get('projectIds')?.setValue(selectedProjects);
            }
          }
        } else {
          console.log('No projects found for the selected department');
          this.projects = [];
        }
      },
      (error) => {
        console.error('Failed to load projects', error);
        this.projects = [];
      }
    );
  }

  onSubmitDepartment() {
    this.departmentPopupShow = false;
    this.isAddDepartment = false;
    if (this.departmentForm.valid) {
        const departmentData = {
          name: this.normalizeWhitespace(
            this.departmentForm.get('name')?.value
          ),
          departmentCode: this.normalizeWhitespace(
            this.departmentForm.get('departmentCode')?.value
          ),
        };
        this.isLoader = true;
        this.api.addNewDepartment(departmentData).subscribe({
          next: (response) => {
            this.departmentForm.reset();
            this.loadDepartments();
            this.isLoader = false;
             this.isDepartmentSuccess = true;
          },
          error: (error) => {
            let errorMessage = '';

            if (error.status === 400) {
              errorMessage =
                'Validation error: ' +
                (error.error?.message || `Department with the name '${departmentData.name}' already exists`);
            } else if (error.status === 500) {
              errorMessage = 'Server error: An internal server error occurred';
            } else if (error.status === 401) {
              errorMessage = 'Authentication error: Please log in again';
            } else if (error.status === 403) {
              errorMessage =
                'Authorization error: You do not have permission to perform this action';
            } else {
              errorMessage =
                error.error?.message ||
                error.message ||
                'Unknown error occurred';
            }

            this.isAddDepartmentFail=true;
            this.isLoader = false;
          },
        });
    }
  }

  onSubmitUser() {
    this.userPopupShow = false;
    this.isAddUser = false;
    if (this.userForm.valid) {

      const formData = this.userForm.getRawValue();
      console.log("enter userdata");
      const userData = {
        email: this.normalizeWhitespace(formData.email),
        fullName: this.normalizeWhitespace(formData.fullName),
        departmentName: this.normalizeWhitespace(formData.departmentName),
        projectIds: Array.isArray(formData.projectIds)
          ? formData.projectIds
            .map((project: any) =>
              typeof project === 'object' ? project.id : project
            )
            .filter(Boolean)
          : [],
      };
      this.isLoader = true;
      this.api.addNewUser(userData).subscribe({
        next: (response) => {
          const emailContext = {
            email: userData.email,
            fullName: userData.fullName,
            defaultPassword: 'experion@123',
          };
          this.isUserSuccess = true;
          this.emailService
            .sendUserRegistrationEmail(formData.email, emailContext)
            .subscribe({
              next: (emailSent) => {
                this.isLoader = false;
                this.isSendEmailSuccess=true; 
              },
              error: (emailError) => {
                this.isLoader = false;
                this.isSendEmailFail=true;
              },
            });

          this.resetUserForm();
          this.refreshUsersData();
        },
        error: (error) => {
          let errorMessage = this.getErrorMessage(error);
          this.isLoader = false;
          this.isAdduserFail=true;
        },
      });

    } else {
      Object.keys(this.userForm.controls).forEach((key) => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
        control?.updateValueAndValidity();
      });
      this.isLoader = false;
    }
  }

  private getErrorMessage(error: any): string {
    switch (error.status) {
      case 400:
        return ' Please check your input data.User with the email already exists';
      case 401:
        return 'Authentication error: Please log in again.';
      case 403:
        return 'Authorization error: You do not have permission to perform this action.';
      case 409:
        return 'Conflict: User already exists.';
      case 500:
        return 'Server error: An internal server error occurred.';
      default:
        return (
          error.error?.message || error.message || 'Unknown error occurred.'
        );
    }
  }

  onSubmitProject() {
    this.projectPopupShow = false;
    this.isAddProject = false;
    if (this.projectForm.valid) {
        const projectData = this.projectForm.getRawValue();
        this.isLoader = true;
        this.api.addNewProject(projectData).subscribe({
          next: (response) => {
            this.projectForm.reset();
            if (this.authService.getUserRole() === 'DepartmentUser') {
              const userDepartment = this.authService.getDepartmentName();
              this.projectForm.patchValue({ departmentName: userDepartment });
            }

            if (projectData.departmentName) {
              this.loadProjectsForDepartment(projectData.departmentName);
            }
            this.isLoader = false;
            this.isProjectSuccess = true;
          },
          error: (error) => {
            let errorMessage = '';

            if (error.status === 400) {
              errorMessage =
                (error.error?.message || 'Invalid data provided :Project with the name already exists');
            } else if (error.status === 500) {
              errorMessage = 'Server error: An internal server error occurred';
            } else if (error.status === 401) {
              errorMessage = 'Authentication error: Please log in again';
            } else if (error.status === 403) {
              errorMessage =
                'Authorization error: You do not have permission to perform this action';
            } else {
              errorMessage =
                error.error?.message ||
                error.message ||
                'Unknown error occurred';
            }
            this.isLoader = false;
            this.isAddprojectFail=true;
          },
        });
    } else {
      Object.keys(this.projectForm.controls).forEach((key) => {
        const control = this.projectForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  onDepartmentSelect(dept: department) {
    if (dept) {
      const normalizedDeptName = this.normalizeWhitespace(dept.departmentName);
      const normalizedDeptCode = this.normalizeWhitespace(dept.departmentCode);

      this.updateDepartmentForm.patchValue({
        newDepartmentName: normalizedDeptName,
        newDepartmentCode: normalizedDeptCode,
      });
    }
  }

  onUpdateDepartment() {
    this.updatedepartmentPopupShow = false;
    this.isUpdatedepartment = false;
    if (this.updateDepartmentForm.valid) {
        const updateData = {
          departmentName: this.normalizeWhitespace(
            this.updateDepartmentForm.get('departmentName')?.value
          ),
          newDepartmentName: this.normalizeWhitespace(
            this.updateDepartmentForm.get('newDepartmentName')?.value
          ),
          newDepartmentCode: this.normalizeWhitespace(
            this.updateDepartmentForm.get('newDepartmentCode')?.value
          ),
        };
        this.isLoader = true;
        this.api.updateDepartment(updateData).subscribe({
          next: (response) => {
            this.updateDepartmentForm.reset();
            this.loadDepartments();
            this.isLoader = false;
            this.isUpdatedepartmentSuccess = true;

          },
          error: (error) => {
            let errorMessage = '';

            if (error.status === 400) {
              errorMessage =
                'Validation error: ' +
                (error.error?.message || 'Invalid data provided');
            } else if (error.status === 500) {
              errorMessage = 'Server error: An internal server error occurred';
            } else if (error.status === 401) {
              errorMessage = 'Authentication error: Please log in again';
            } else if (error.status === 403) {
              errorMessage =
                'Authorization error: You do not have permission to perform this action';
            } else {
              errorMessage =
                error.error?.message ||
                error.message ||
                'Unknown error occurred';
            }
            this.isLoader = false;
            this.isUpdateDepartmentFail=true;
          },
        });
    }
  }

  onProjectSelect(project: project) {
    if (project) {
      this.id = project.id;
      this.updateProjectForm.patchValue({
        newProjectName: project.name,
        newProjectCode: project.projectCode,
      });
    }
  }

  onProjectDepartmentSelect(dept: department) {
    if (dept) {
      this.updateProjectForm.patchValue({
        selectedDepartment: dept.departmentName,
      });
    }
  }

  onUpdateProject() {
    this.updateProjectPopupShow = false;
    this.isUpdateProject = false;
    if (this.updateProjectForm.valid) {
        const projectId = this.id;
        const updateData: any = {
          projectName: this.updateProjectForm.get('projectName')?.value,
          newProjectName: this.updateProjectForm.get('newProjectName')?.value,
          newProjectCode: this.updateProjectForm.get('newProjectCode')?.value,
        };
        this.isLoader = true;
        this.api.updateProject(updateData, projectId).subscribe({
          next: (response) => {
            this.updateProjectForm.reset();
            
            const userRole = this.authService.getUserRole();
            const userDepartment = this.authService.getDepartmentName();

            if (userRole === 'DepartmentUser' || userRole?.includes('ProjectUsers')) {
              this.updateProjectForm.patchValue({
                selectedDepartment: userDepartment,
              });
            }
            if (this.updateProjectForm.get('selectedDepartment')?.value) {
              this.loadProjectsForDepartment(
                this.updateProjectForm.get('selectedDepartment')?.value
              );
            }
            this.isLoader = false;
            this.isUpdateProjectSuccess = true;
          },
          error: (error) => {
            let errorMessage = '';

            if (error.status === 400) {
              errorMessage =
                'Validation error: ' +
                (error.error?.message || 'Invalid data provided');
            } else if (error.status === 500) {
              errorMessage = 'Server error: An internal server error occurred';
            } else if (error.status === 401) {
              errorMessage = 'Authentication error: Please log in again';
            } else if (error.status === 403) {
              errorMessage =
                'Authorization error: You do not have permission to perform this action';
            } else {
              errorMessage =
                error.error?.message ||
                error.message ||
                'Unknown error occurred';
            }
            this.isLoader = false;
            this.isUpdateProjectFail=true;
          },
        });
    }
  }

  onProjectsSelected(projects: project[]) {
    // console.log('Selected projects:', projects);
  }

  onEditUser(user: any): void {
    console.log("user.....", user)
    this.isLoader = true;

    const userProjects = user.projects || [];

    this.editUserForm.reset();

    this.editUserForm.patchValue({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      departmentName: user.department || user.departmentName,
    });

    if (user.department || user.departmentName) {
      this.isEditUser=true;
      this.api.getProjects(user.department || user.departmentName).subscribe(
        (projects) => {
          this.editUserForm.patchValue({ projectIds: userProjects });
          this.isLoader = false;
        },
        (error) => {
          console.error('Failed to load projects for department', error);
          this.isLoader = false;
        }
      );
    } else {
      this.isLoader = false;
    }
  }

  onDepartmentChange() {
    const departmentControl = this.editUserForm?.get('departmentName');
    const department = departmentControl?.value;

    if (department) {
      const projectsControl = this.editUserForm?.get('projectIds');
      const currentProjects = projectsControl?.value || [];

      this.api.getProjects(department).subscribe(
        (projects: any[]) => {
          const validProjects = currentProjects.filter((project: any) => {
            const projectId =
              typeof project === 'object' && project ? project.id : project;
            return projects.some((p: any) => p.id === projectId);
          });

          this.editUserForm?.patchValue({ projectIds: validProjects });
        },
        (error) => {
          console.error('Failed to load projects for department', error);
        }
      );
    }
  }


  onSubmitEditUser(): void {
    this.edituserPopupShow = false;
    this.isEditUser = false;
    if (this.editUserForm.valid) {
        const formData = this.editUserForm.getRawValue();

        const userData = {
          email: this.normalizeWhitespace(formData.email),
          fullName: this.normalizeWhitespace(formData.fullName),
          departmentName: this.normalizeWhitespace(formData.departmentName),
          projectIds: Array.isArray(formData.projectIds)
            ? formData.projectIds
              .map((project: any) =>
                typeof project === 'object' ? project.id : project
              )
              .filter(Boolean)
            : [],
        };
        const userId = formData.id;

        this.isLoader = true;
        this.api.updateUser(userId, userData).subscribe({
          next: (response) => {
            this.isEditUserSuccess=true;
            const emailContext = {
              email: userData.email,
              fullName: userData.fullName,
              departmentName: userData.departmentName || 'Not specified',
              userEmail: userData.email,
              projects: Array.isArray(formData.projectIds)
                ? formData.projectIds
                  .map((project: any) =>
                    typeof project === 'object' ? project.name : project
                  )
                  .filter(Boolean)
                : [],
            };

            console.log('Email context being sent:', emailContext);

            this.emailService
              .sendUserUpdateEmail(formData.email, emailContext)
              .subscribe({
                next: (emailSent) => {
                  
                    this.isLoader = false;
                    this.isSendEmailSuccess=true;
                  
                },
                error: (emailError) => {
                  this.isLoader = false;
                  this.isSendEmailFail=true;
                },
              });

            this.refreshUsersData();
          },
          error: (error) => {
            let errorMessage = this.getErrorMessage(error);
            this.isLoader = false;
            this.isEditUserFail=true;
          },
        });
      

    } else {
      Object.keys(this.editUserForm.controls).forEach((key) => {
        const control = this.editUserForm.get(key);
        control?.markAsTouched();
        control?.updateValueAndValidity();
      });
    }
  }

  onEditProjectsSelected(projects: any[]): void {
    this.editUserForm.get('projectIds')?.setValue(projects);
  }

  isAddUser: boolean = false;
  isAddDepartment: boolean = false;
  departmentPopupShow:boolean=false;
  isDepartmentSuccess:boolean=false;

  isAddProject: boolean = false;
  projectPopupShow:boolean=false;
  isProjectSuccess:boolean=false;

  isUpdatedepartment: boolean = false;
  updatedepartmentPopupShow:boolean=false;
  isUpdatedepartmentSuccess:boolean=false;

  isUpdateProject: boolean = false;
  updateProjectPopupShow:boolean=false;
  isUpdateProjectSuccess:boolean=false;

  isEditUser: boolean = false;
  edituserPopupShow:boolean=false;
  isEditUserSuccess:boolean=false;

  isAdduserFail:boolean=false;
  isAddDepartmentFail:boolean=false;

  


  addUser() {
    this.isAddUser = true;
  }
  addDepartment() {
    this.isAddDepartment = true;

  }
  addproject(){
    this.isAddProject=true;
  }
  updateDepartment(){
    this.isUpdatedepartment=true;
  }
  updateProject(){
    this.isUpdateProject=true;
  }
  editUser(){
    this.isEditUser=true;
  }




  onCancel() {
    this.isAddUser = false;
    this.userForm.reset();
    this.resetUserForm();
  }
  onDepartmentcancel(){
    this.isAddDepartment = false;
    this.departmentForm.reset();
  }
  onProjectcancel(){
    this.isAddProject=false;
    this.projectForm.reset();
 
    const userRole = this.authService.getUserRole();
    const userDepartment = this.authService.getDepartmentName();

    if (userRole === 'DepartmentUser' || userRole?.includes('ProjectUsers')) {
      this.projectForm.patchValue({
        departmentName: userDepartment,
      });
    }
  }
  onUpdateDepartmentCancel(){
    this.isUpdatedepartment=false;
    this.updateDepartmentForm.reset();
  }
  onUpdateProjectCancel(){
    this.isUpdateProject=false;
    this.updateProjectForm.reset();

    const userRole = this.authService.getUserRole();
    const userDepartment = this.authService.getDepartmentName();

    if (userRole === 'DepartmentUser' || userRole?.includes('ProjectUsers')) {
      this.updateProjectForm.patchValue({
        selectedDepartment: userDepartment,
      });
    }
  }
  onEditUserCancel(){
    this.isEditUser=false;
    this.editUserForm.reset();
  }





  onConformUser() {
    this.userPopupShow = true;
  }
  onConformDepartment(){
    this.departmentPopupShow=true;
  }
  onConformProject(){
    this.projectPopupShow=true;
  }
  onConformUpdateDepartment(){
    this.updatedepartmentPopupShow=true;
  }
 onConformUpdateProject(){
  this.updateProjectPopupShow=true;
 }
 onConformEditUser(){
  this.edituserPopupShow=true;
 }





  onCloseUser() {
    this.userPopupShow = false;
  }
  onCloseDepartment(){
    this.departmentPopupShow=false;
  }
  onCloseProject(){
    this.projectPopupShow=false;
  }
  onCloseUpdateDepartment(){
    this.updatedepartmentPopupShow=false;
  }
  onCloseUpdateProject(){
    this.updateProjectPopupShow=false;
  }
  onCloseEditUser(){
    this.edituserPopupShow=false;
  }






  closeUserSuccess() {
    this.isUserSuccess = false;
  }

  closeDepartmentSuccess(){
    this.isDepartmentSuccess=false;
  }
  closeProjectSuccess(){
    this.isProjectSuccess=false;
  }

  closeUpdatedDepartmentSuccess(){
    this.isUpdatedepartmentSuccess=false;
  }
  closeUpdateProjectSuccess(){
    this.isUpdateProjectSuccess=false;
  }
  closeEdituserSuccess(){
    this.isEditUserSuccess=false;
  }



  isAddprojectFail:boolean=false;
  isUpdateDepartmentFail:boolean=false;
  isUpdateProjectFail:boolean=false;
  isEditUserFail:boolean=false;
  isSendEmailFail:boolean=false;
  isSendEmailSuccess:boolean=false;

  adduserFail(){
    this.isAdduserFail=false;
  }
  addDepartmentFail(){
    this.isAddDepartmentFail=false;
  }
  addprojectFail(){
    this.isAddprojectFail=false;
  }
  updateDepartmentFail(){
    this.isUpdateDepartmentFail=false;
  }
  updateProjectFail(){
    this.isUpdateProjectFail=false;
  }
  editUserFail(){
    this.isEditUserFail=false;
  }
  sendEmailFail(){
    this.isSendEmailFail=false;
  }
  sendEmailSuccess(){
    this.isSendEmailSuccess=false;
  }

  
}

import { department } from './../../Interfaces/deparments.interface';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { UserTableComponent } from "../../Components/user-table/user-table.component";
import { project } from '../../Interfaces/projects.interface';
import { ReusableTableComponent } from "../../Components/reusable-table/reusable-table.component";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ReactiveFormsModule, BodyContainerComponent, UserTableComponent, ReusableTableComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  departments:department[]=[
    {
    id:1,
    departmentName:'HR'
    },
    {
    id:2,
    departmentName:'SFM'
    },
    {
    id:3,
    departmentName:'Audit and Compliance'
    },
    {
    id:4,
    departmentName:'DU1'
    },
  ];
  
  projects:project[]=[
    {
      id:1,
      projectName: "Japanese Report"
    },
    {
      id:2,
      projectName: "Risk Management"
    },
    {
      id:1,
      projectName: "Training Calendar"
    },
  
  ]
  

  userForm: FormGroup;
  departmentForm: FormGroup;
  projectForm: FormGroup;

  constructor() {
    this.departmentForm = new FormGroup({
      departmentName: new FormControl('', Validators.required),
    });
    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      department: new FormControl('', Validators.required),
      projectName: new FormControl(''),
    });
    this.projectForm = new FormGroup({
      projectName: new FormControl('', Validators.required),
      departmentName: new FormControl('', Validators.required),

    });
  }

  ngOnInit(): void {}

  onSubmitDepartment() {
    if (this.departmentForm.valid) {
      console.log('Department saved:', this.departmentForm.value);
      // alert(`Department "${this.departmentForm.value.departmentName}" saved successfully!`);
      this.departmentForm.reset();
      const modal = document.getElementById('addDepartmentModal');
      if (modal) {
        (modal as HTMLElement).click();
      }
    } else {
      console.log('Form invalid');
    }
  }



  onSubmitUser() {
    if (this.userForm.valid) {
      console.log('User saved:', this.userForm.value);
      // alert(`User "${this.userForm.value.name}" added successfully!`);
      this.userForm.reset();
      const modal = document.getElementById('addUserModal');
      if (modal) {
        (modal as HTMLElement).click();
      }
    } else {
      console.log('Form invalid');
    }
  }

  onSubmitProject() {
    if (this.projectForm.valid) {
      console.log('Project saved:', this.projectForm.value);
      this.projectForm.reset();
      const modal = document.getElementById('addProjectModal');
      if (modal) {
        (modal as HTMLElement).click();
      }
    } else {
      console.log('Form invalid');
    }
    }


    headerData:any=["Name","Email","Department","Projects"]
    tableBody: any = [
      {
        Name: "John Doe",
        Email: "john.doe@example.com",
        Department: "Engineering",
        Projects: "Project A, Project B",

      },
      {
        Name: "Jane Smith",
        Email: "jane.smith@example.com",
        Department: "Marketing",
        Projects: "Campaign X, Campaign Y",
    
      },
      {
        Name: "Alice Johnson",
        Email: "alice.johnson@example.com",
        Department: "HR",
        Projects: "Recruitment, Employee Engagement",
  
      }
    ];
}

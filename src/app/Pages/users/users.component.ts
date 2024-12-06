import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  userForm: FormGroup;
  departmentForm: FormGroup;

  constructor() {
    this.departmentForm = new FormGroup({
      departmentName: new FormControl('', Validators.required),
    });
    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      department: new FormControl('', Validators.required),
      projectId: new FormControl(''),
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
}

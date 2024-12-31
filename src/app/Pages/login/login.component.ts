import { Component } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserDropdownComponent } from "../../UI/user-dropdown/user-dropdown.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, UserDropdownComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {



  navigateToLogin() {
    this.router.navigate(['/home']);

  }


  constructor( public api:ApiService, private fb: FormBuilder, private router: Router) {

  }


}

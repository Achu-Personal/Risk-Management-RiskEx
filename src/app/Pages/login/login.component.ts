import { Component } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {


  navigateToLogin() {
    this.router.navigate(['/dashboard']);

  }


  constructor( public api:ApiService, private fb: FormBuilder, private router: Router) {

  }
}

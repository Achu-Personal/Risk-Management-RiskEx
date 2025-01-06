import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { ChangepasswordComponent } from "../../Components/changepassword/changepassword.component";

@Component({
  selector: 'app-forgetpswrd',
  standalone: true,
  imports: [ChangepasswordComponent],
  templateUrl: './forgetpswrd.component.html',
  styleUrl: './forgetpswrd.component.scss'
})
export class ForgetpswrdComponent {

  email: string = '';
forgotPasswordForm: any;

navigateToReset() {
  this.router.navigate(['/resetpassword']);

}

constructor( public api:ApiService, private fb: FormBuilder, private router: Router) {

}

  onSubmit(): void {
    if (this.email) {
      console.log('Password recovery email sent to:', this.email);
      // Implement password recovery logic here
    }
  }


}

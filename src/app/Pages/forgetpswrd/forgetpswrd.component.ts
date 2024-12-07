import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgetpswrd',
  standalone: true,
  imports: [],
  templateUrl: './forgetpswrd.component.html',
  styleUrl: './forgetpswrd.component.scss'
})
export class ForgetpswrdComponent {

  email: string = '';

  onSubmit(): void {
    if (this.email) {
      console.log('Password recovery email sent to:', this.email);
      // Implement password recovery logic here
    }
  }


}

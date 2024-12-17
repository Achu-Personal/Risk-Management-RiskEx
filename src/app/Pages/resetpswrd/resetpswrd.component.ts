import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';

@Component({
  selector: 'app-resetpswrd',
  standalone: true,
  imports: [],
  templateUrl: './resetpswrd.component.html',
  styleUrl: './resetpswrd.component.scss'
})
export class ResetpswrdComponent {





  navigateTologin() {
    this.router.navigate(['/auth']);

}


constructor( public api:ApiService, private fb: FormBuilder, private router: Router) {

}
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-sso',
  standalone: true,
  imports: [],
  templateUrl: './sso.component.html',
  styleUrl: './sso.component.scss'
})
export class SsoComponent {


  signInWithMicrosoft() {
    // Implement Microsoft sign-in logic here
    console.log('Signing in with Microsoft');
  }
}

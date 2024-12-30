import { Component } from '@angular/core';
import { ProfileComponent } from "../../UI/profile/profile.component";

@Component({
  selector: 'app-sso',
  standalone: true,
  imports: [ProfileComponent],
  templateUrl: './sso.component.html',
  styleUrl: './sso.component.scss'
})
export class SsoComponent {


  signInWithMicrosoft() {
    // Implement Microsoft sign-in logic here
    console.log('Signing in with Microsoft');
  }
}

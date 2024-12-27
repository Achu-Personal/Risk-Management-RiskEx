import { department } from './../../Interfaces/deparments.interface';
import { Component, Input } from '@angular/core';
import { DropdownComponent } from "../dropdown/dropdown.component";
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  @Input() location: string = '';
  @Input() name: string = '';
  @Input() title: string = '';
  @Input() avatarUrl: string = '';
  @Input() department: string = '';

  // @Input() metrics: ProfileMetric[] = [];
}

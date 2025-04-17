import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss'
})
export class UnauthorizedComponent implements OnInit {
  errorType: string = 'permission'; 

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get error type from query parameters
    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        this.errorType = params['type'];
      }
    });
  }
}

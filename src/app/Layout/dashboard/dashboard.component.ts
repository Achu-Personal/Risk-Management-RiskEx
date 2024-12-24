import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../../Components/sidebar/sidebar.component";
import { NavbarComponent } from "../../UI/navbar/navbar.component";
import { CrumbsComponent } from "../../UI/crumbs/crumbs.component";
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent, CrumbsComponent, BodyContainerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  navbarData: any = {};

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
      this.router.events.subscribe(() => {

          const routeData = this.activatedRoute.firstChild?.snapshot.data;
          this.navbarData = routeData || {};
      });
  }
}

// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { CrumbsComponent } from './crumbs.component';
// import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
// import { Subject } from 'rxjs/internal/Subject';
// import { By } from '@angular/platform-browser';

// describe('CrumbsComponent', () => {
//   let component: CrumbsComponent;
//   let fixture: ComponentFixture<CrumbsComponent>;

//   // beforeEach(async () => {
//   //   await TestBed.configureTestingModule({
//   //     imports: [CrumbsComponent]
//   //   })
//   //   .compileComponents();

//   //   fixture = TestBed.createComponent(CrumbsComponent);
//   //   component = fixture.componentInstance;
//   //   fixture.detectChanges();
//   // });

//   // it('should create', () => {
//   //   expect(component).toBeTruthy();
//   // });
//   // let component: CrumbsComponent;
//   // let fixture: ComponentFixture<CrumbsComponent>;
//   let router: Router;
//   let routerEventsSubject: Subject<any>;

//   beforeEach(() => {
//     // Create a new Subject to mock router events
//     routerEventsSubject = new Subject<any>();

//     // Mock ActivatedRoute
//     const activatedRouteStub = {
//       root: {
//         children: [
//           {
//             snapshot: {
//               url: [{ path: 'home' }],
//               data: { breadcrumb: 'Home' }
//             },
//             children: [
//               {
//                 snapshot: {
//                   url: [{ path: 'dashboard' }],
//                   data: { breadcrumb: 'Dashboard' }
//                 },
//                 children: []
//               }
//             ]
//           }
//         ]
//       }
//     };

//     TestBed.configureTestingModule({
//       declarations: [CrumbsComponent],
//       imports: [RouterTestingModule],
//       providers: [
//         { provide: ActivatedRoute, useValue: activatedRouteStub },
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(CrumbsComponent);
//     component = fixture.componentInstance;
//     router = TestBed.inject(Router);

//     // Overriding the events property to use our mock Subject
//     (router as any).events = routerEventsSubject.asObservable();
//   });

//   // Test: Component initialization with default values
//   it('should initialize with an empty breadcrumbs array', () => {
//     fixture.detectChanges();
//     expect(component.breadcrumbs.length).toBe(0);
//   });

//   // Test: Breadcrumb creation on NavigationEnd event
//   it('should create breadcrumbs when NavigationEnd event is triggered', () => {
//     // Simulate NavigationEnd event
//     routerEventsSubject.next(new NavigationEnd(1, '/home', '/home'));
//     fixture.detectChanges();

//     // Check the breadcrumbs array after the event
//     expect(component.breadcrumbs.length).toBe(2);
//     expect(component.breadcrumbs[0].label).toBe('Home');
//     expect(component.breadcrumbs[1].label).toBe('Dashboard');
//     expect(component.breadcrumbs[0].url).toBe('/home');
//     expect(component.breadcrumbs[1].url).toBe('/home/dashboard');
//   });

//   // Test: createBreadcrumbs method
//   it('should return correct breadcrumbs structure', () => {
//     const mockActivatedRoute = {
//       snapshot: { url: [{ path: 'home' }], data: { breadcrumb: 'Home' } },
//       children: [
//         {
//           snapshot: { url: [{ path: 'about' }], data: { breadcrumb: 'About' } },
//           children: []
//         }
//       ]
//     };

//     const breadcrumbs = component.createBreadcrumbs(mockActivatedRoute as any);
//     expect(breadcrumbs.length).toBe(2);
//     expect(breadcrumbs[0].label).toBe('Home');
//     expect(breadcrumbs[1].label).toBe('About');
//     expect(breadcrumbs[0].url).toBe('/home');
//     expect(breadcrumbs[1].url).toBe('/home/about');
//   });

//   // Test: Breadcrumb URLs are correctly formed
//   it('should form correct breadcrumb URLs when nested routes exist', () => {
//     const mockRouteData = {
//       children: [
//         {
//           snapshot: {
//             url: [{ path: 'home' }],
//             data: { breadcrumb: 'Home' }
//           },
//           children: [
//             {
//               snapshot: {
//                 url: [{ path: 'settings' }],
//                 data: { breadcrumb: 'Settings' }
//               },
//               children: []
//             }
//           ]
//         }
//       ]
//     };

//     // Trigger breadcrumb generation
//     routerEventsSubject.next(new NavigationEnd(1, '/home', '/home'));
//     fixture.detectChanges();

//     // Check the breadcrumb URLs
//     expect(component.breadcrumbs[0].url).toBe('/home');
//     expect(component.breadcrumbs[1].url).toBe('/home/settings');
//   });

//   // Test: The breadcrumb links are rendered correctly in the template
//   it('should render breadcrumbs in the template', () => {
//     // Set up breadcrumbs manually for testing
//     component.breadcrumbs = [
//       { label: 'Home', url: '/home' },
//       { label: 'Dashboard', url: '/home/dashboard' }
//     ];
//     fixture.detectChanges();

//     // Query for breadcrumb elements
//     const breadcrumbItems = fixture.debugElement.queryAll(By.css('.breadcrumb-item'));
//     expect(breadcrumbItems.length).toBe(2);
//     expect(breadcrumbItems[0].nativeElement.textContent).toContain('Home');
//     expect(breadcrumbItems[1].nativeElement.textContent).toContain('Dashboard');
//   });
// });

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceComponent } from './reference.component';

describe('ReferenceComponent', () => {
  let component: ReferenceComponent;
  let fixture: ComponentFixture<ReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize correctly', () => {
    expect(component.tabs.length).toBe(5);
    expect(component.likelyHoodTableBody.length).toBe(4);
    expect(component.impactTableBody.length).toBe(4);
    expect(component.riskResponseBody.length).toBe(4);
    expect(component.QMSTablebody.length).toBe(3);
    expect(component.ISMSTableBody.length).toBe(3);
  });
  it('should select the correct tab when clicked', () => {
    // Initial selectedTab value is 0
    expect(component.selectedTab).toBe(0);
  
    // Simulate clicking the second tab (index 1)
    component.selectTab(1);
    expect(component.selectedTab).toBe(1);
  
    // Simulate clicking the fourth tab (index 3)
    component.selectTab(3);
    expect(component.selectedTab).toBe(3);
  });
  it('should render the correct tab content based on selectedTab', () => {
    component.selectTab(0);
    fixture.detectChanges();
    let content = fixture.nativeElement.querySelector('.content-section');
    expect(content).toBeTruthy(); // Content should be rendered for selected tab
  
    component.selectTab(1);
    fixture.detectChanges();
    content = fixture.nativeElement.querySelector('.content-section');
    expect(content).toBeTruthy();
  
    component.selectTab(2);
    fixture.detectChanges();
    content = fixture.nativeElement.querySelector('.content-section');
    expect(content).toBeTruthy();
  });

  it('should render tab buttons and handle click events', () => {
    const tabButtons = fixture.nativeElement.querySelectorAll('.tabs button');
    expect(tabButtons.length).toBe(component.tabs.length);
  
    // Simulate a click on the first tab button
    tabButtons[0].click();
    fixture.detectChanges();
    expect(component.selectedTab).toBe(0);
  
    // Simulate a click on the second tab button
    tabButtons[1].click();
    fixture.detectChanges();
    expect(component.selectedTab).toBe(1);
  });
  it('should render the app-heatmap component', () => {
    const heatmapComponent = fixture.nativeElement.querySelector('app-heatmap');
    expect(heatmapComponent).toBeTruthy(); // Check if heatmap component is rendered
  });
  it('should start with the first tab selected', () => {
    expect(component.selectedTab).toBe(0);
    const content = fixture.nativeElement.querySelector('.content-section');
    expect(content).toBeTruthy(); // Verify that the first tab content is displayed
  });
      
});

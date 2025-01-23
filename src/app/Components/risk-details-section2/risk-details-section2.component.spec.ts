// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { RiskDetailsSection2Component } from './risk-details-section2.component';
// import { StepperComponent } from "../../UI/stepper/stepper.component";
// import { By } from '@angular/platform-browser';

// describe('RiskDetailsSection2Component', () => {
//   let component: RiskDetailsSection2Component;
//   let fixture: ComponentFixture<RiskDetailsSection2Component>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [StepperComponent],
//       declarations: [RiskDetailsSection2Component]
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(RiskDetailsSection2Component);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should display risk mitigation text', () => {
//     component.riskMitigation = 'Mitigation plan for the risk';
//     fixture.detectChanges();
//     const mitigationElement = fixture.debugElement.query(By.css('.details-card p'));
//     expect(mitigationElement.nativeElement.textContent).toContain('');
//   });

//   it('should conditionally render risk contingency when value is provided', () => {
//     component.riskContengency = 'Contingency plan for the risk';
//     fixture.detectChanges();
//     const contingencyElement = fixture.debugElement.query(By.css('.details-card:nth-of-type(2)'));
//     expect(contingencyElement).toBeTruthy();
//     expect(contingencyElement.nativeElement.textContent).toContain('Contingency plan for the risk');
//   });

//   it('should not render risk contingency when value is empty', () => {
//     component.riskContengency = '';
//     fixture.detectChanges();
//     const contingencyElement = fixture.debugElement.query(By.css('.details-card:nth-of-type(2)'));
//     expect(contingencyElement).toBeNull();
//   });

//   it('should display impact of the risk', () => {
//     component.impact = 'High impact due to multiple issues';
//     fixture.detectChanges();
//     const impactElement = fixture.debugElement.query(By.css('.responsibility-of-action-planned-Action-div p'));
//     expect(impactElement.nativeElement.textContent).toContain('High impact due to multiple issues');
//   });

//   it('should display responsibility of action', () => {
//     component.responsibilityOfAction = 'John Doe';
//     fixture.detectChanges();
//     const responsibilityElement = fixture.debugElement.query(By.css('.responsibility-of-action-planned-Action-div h6:nth-of-type(1)'));
//     expect(responsibilityElement.nativeElement.textContent).toContain('John Doe');
//   });

//   it('should display planned action date', () => {
//     component.plannedActionDate = '2024-12-31';
//     fixture.detectChanges();
//     const plannedDateElement = fixture.debugElement.query(By.css('.responsibility-of-action-planned-Action-div h6:nth-of-type(2)'));
//     expect(plannedDateElement.nativeElement.textContent).toContain('2024-12-31');
//   });

//   it('should render stepper component for risk progress', () => {
//     const stepperElement = fixture.debugElement.query(By.css('app-stepper'));
//     expect(stepperElement).toBeTruthy();
//   });

//   it('should truncate long risk mitigation text', () => {
//     component.riskMitigation = 'A'.repeat(1050);
//     fixture.detectChanges();
//     const mitigationElement = fixture.debugElement.query(By.css('.details-card p'));
//     expect(mitigationElement.nativeElement.textContent).toContain('A'.repeat(1020) + '..');
//   });

//   it('should truncate long risk contingency text', () => {
//     component.riskContengency = 'B'.repeat(1050);
//     fixture.detectChanges();
//     const contingencyElement = fixture.debugElement.query(By.css('.details-card:nth-of-type(2) p'));
//     if (contingencyElement) {
//       expect(contingencyElement.nativeElement.textContent).toContain('B'.repeat(1020) + '..');
//     }
//   });
// });

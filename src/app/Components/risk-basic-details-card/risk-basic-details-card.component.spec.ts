// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { RiskBasicDetailsCardComponent } from './risk-basic-details-card.component';

// describe('RiskBasicDetailsCardComponent', () => {
//   let component: RiskBasicDetailsCardComponent;
//   let fixture: ComponentFixture<RiskBasicDetailsCardComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [RiskBasicDetailsCardComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(RiskBasicDetailsCardComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should display the correct risk number and type', () => {
//     component.riskNumber = '123';
//     component.riskType = 'High';
//     fixture.detectChanges();

//     const compiled = fixture.nativeElement as HTMLElement;
//     const riskCodeText = compiled.querySelector('.risk-code')?.textContent;

//     expect(riskCodeText).toContain('123');
//     expect(riskCodeText).toContain('High Risk');
//   });

//   it('should display the risk name and truncated description', () => {
//     component.riskName = 'Risk Example';
//     component.riskDesc = 'This is a detailed description of the risk exceeding 1000 characters.';
//     fixture.detectChanges();

//     const compiled = fixture.nativeElement as HTMLElement;
//     const riskNameText = compiled.querySelector('.riskdesc h5')?.textContent;
//     const riskDescText = compiled.querySelector('.riskdesc p')?.textContent;

//     expect(riskNameText).toBe('Risk Example');
//     expect(riskDescText).toContain('This is a detailed description of the risk exceeding 1000 characters...');
//   });

//   it('should display the risk status card based on riskStatus', () => {
//     component.riskStatus = 'open';
//     fixture.detectChanges();

//     const statusCard = fixture.nativeElement.querySelector('app-risk-status-card');
//     expect(statusCard).toBeTruthy();
//     expect(statusCard.getAttribute('isOpen')).toBe('true');
//   });

//   it('should display the overall risk rating', () => {
//     component.overallRiskRating = 5;
//     fixture.detectChanges();

//     const ratingCard = fixture.nativeElement.querySelector('app-overall-rating-card');
//     expect(ratingCard).toBeTruthy();
//     expect(ratingCard.getAttribute('value')).toBe('5');
//   });

//   // it('should navigate to edit route on edit button click', () => {
//   //   component.allData = { id: 1 };
//   //   component.onEditButtonClicked();

//   //   expect(mockRouter.navigate).toHaveBeenCalledWith(['edit'], { state: { riskData: { id: 1 } } });
//   // });

//   it('should hide edit button if isEditable is false', () => {
//     component.isEditable = false;
//     fixture.detectChanges();

//     const editButton = fixture.nativeElement.querySelector('app-edit-button');
//     expect(editButton.style.display).toBe('none');
//   });

//   it('should show edit button if isEditable is true', () => {
//     component.isEditable = true;
//     fixture.detectChanges();

//     const editButton = fixture.nativeElement.querySelector('app-edit-button');
//     expect(editButton.style.display).toBe('flex');
//   });
// });

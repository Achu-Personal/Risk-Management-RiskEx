import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RiskStatusCardComponent } from './risk-status-card.component';

describe('RiskStatusCardComponent', () => {
  let component: RiskStatusCardComponent;
  let fixture: ComponentFixture<RiskStatusCardComponent>;
  let divElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskStatusCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskStatusCardComponent);
    component = fixture.componentInstance;
    divElement = fixture.debugElement.query(By.css('div')).nativeElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should apply correct background color when isOpen is false', () => {
    component.isOpen = false;
    fixture.detectChanges();
    expect(divElement.style.backgroundColor).toBe('rgb(52, 199, 89)'); // #34C759
    expect(divElement.textContent).toBe('closed');
  });

  it('should apply correct background color when isOpen is true', () => {
    component.isOpen = true;
    fixture.detectChanges();
    expect(divElement.style.backgroundColor).toBe('rgb(243, 102, 97)'); // #F36661
    expect(divElement.textContent).toBe('Open');
  });

  it('should toggle background color and text when isOpen changes', () => {
    component.isOpen = false;
    fixture.detectChanges();
    expect(divElement.style.backgroundColor).toBe('rgb(52, 199, 89)'); // #34C759
    expect(divElement.textContent).toBe('closed');

    component.isOpen = true;
    fixture.detectChanges();
    expect(divElement.style.backgroundColor).toBe('rgb(243, 102, 97)'); // #F36661
    expect(divElement.textContent).toBe('Open');
  });
});

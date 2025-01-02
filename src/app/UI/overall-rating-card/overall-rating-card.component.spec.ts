import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverallRatingCardComponent } from './overall-rating-card.component';
import { By } from '@angular/platform-browser';

describe('OverallRatingCardComponent', () => {
  let component: OverallRatingCardComponent;
  let fixture: ComponentFixture<OverallRatingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverallRatingCardComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallRatingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // it('should display the correct value and title', () => {
  //   component.value = 50;
  //   component.title = 'Overall Risk Rating';
  //   fixture.detectChanges();

  //   const valueElement = fixture.debugElement.query(By.css('.value')).nativeElement;
  //   const titleElement = fixture.debugElement.query(By.css('h6')).nativeElement;

  //   expect(valueElement.textContent).toBe('50');
  //   expect(titleElement.textContent).toBe('Overall Risk Rating');
  // });

  it('should apply green background color if value <= 30 and no background color is provided', () => {
    component.value = 25;
    component.backgroundColor = '';
    fixture.detectChanges();

    const divElement = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(divElement.style.backgroundColor).toBe('green');
  });

  // it('should apply amber background color if 30 < value < 99 and no background color is provided', () => {
  //   component.value = 50;
  //   component.backgroundColor = '';
  //   fixture.detectChanges();

  //   const divElement = fixture.debugElement.query(By.css('div')).nativeElement;
  //   expect(divElement.style.backgroundColor).toBe('rgb(255, 191, 0)'); // Hex #FFBF00
  // });

  it('should apply red background color if value >= 99 and no background color is provided', () => {
    component.value = 100;
    component.backgroundColor = '';
    fixture.detectChanges();

    const divElement = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(divElement.style.backgroundColor).toBe('red');
  });

  // it('should apply custom background color if provided', () => {
  //   component.backgroundColor = 'blue';
  //   fixture.detectChanges();

  //   const divElement = fixture.debugElement.query(By.css('div')).nativeElement;
  //   expect(divElement.style.backgroundColor).toBe('blue');
  // });

  it('should set text color to green if value <= 30 and no custom color is provided', () => {
    component.value = 20;
    component.textColor = '';
    fixture.detectChanges();

    const divElement = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(divElement.style.color).toBe('green');
  });

  it('should set text color to amber if 30 < value < 99 and no custom color is provided', () => {
    component.value = 50;
    component.textColor = '';
    fixture.detectChanges();

    const divElement = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(divElement.style.color).toBe('rgb(255, 191, 0)'); // Hex #FFBF00
  });

  it('should set text color to red if value >= 99 and no custom color is provided', () => {
    component.value = 100;
    component.textColor = '';
    fixture.detectChanges();

    const divElement = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(divElement.style.color).toBe('red');
  });

  // it('should apply custom text color if provided', () => {
  //   component.textColor = 'blue';
  //   fixture.detectChanges();

  //   const divElement = fixture.debugElement.query(By.css('div')).nativeElement;
  //   expect(divElement.style.color).toBe('blue');
  // });

  it('should set height and width based on input values', () => {
    component.height = 50;
    component.width = 60;
    fixture.detectChanges();

    const divElement = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(divElement.style.height).toBe('50vh');
    expect(divElement.style.width).toBe('60vh');
  });
});

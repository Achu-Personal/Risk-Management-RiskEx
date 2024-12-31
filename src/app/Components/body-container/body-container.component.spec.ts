import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyContainerComponent } from './body-container.component';

describe('BodyContainerComponent', () => {
  let component: BodyContainerComponent;
  let fixture: ComponentFixture<BodyContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default background color', () => {
    expect(component.backgroundColor).toEqual('white');
  });

  it('should have showShadow enabled by default', () => {
    expect(component.showShadow).toBeTrue();
  });

  it('should have default padding', () => {
    expect(component.padding).toEqual('20');
  });

  it('should apply showShadow from input', () => {
    component.showShadow = false;
    fixture.detectChanges();
    const divElement = fixture.nativeElement.querySelector('div');
    expect(divElement.style.boxShadow).toEqual('');
  });



  it('should render content within the component', () => {
    const testContent = 'Test Content';
    fixture.nativeElement.querySelector('.rounded').innerHTML = testContent;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.rounded').textContent).toContain(testContent);
  });

});

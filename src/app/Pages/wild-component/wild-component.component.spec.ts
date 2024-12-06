import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WildComponentComponent } from './wild-component.component';

describe('WildComponentComponent', () => {
  let component: WildComponentComponent;
  let fixture: ComponentFixture<WildComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WildComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WildComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

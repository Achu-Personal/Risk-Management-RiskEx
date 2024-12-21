import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HishamDoubtComponent } from './hisham-doubt.component';

describe('HishamDoubtComponent', () => {
  let component: HishamDoubtComponent;
  let fixture: ComponentFixture<HishamDoubtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HishamDoubtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HishamDoubtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

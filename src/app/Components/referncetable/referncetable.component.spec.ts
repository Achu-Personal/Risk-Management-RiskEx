import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferncetableComponent } from './referncetable.component';

describe('ReferncetableComponent', () => {
  let component: ReferncetableComponent;
  let fixture: ComponentFixture<ReferncetableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferncetableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferncetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleGraphComponent } from './bubble-graph.component';

describe('BubbleGraphComponent', () => {
  let component: BubbleGraphComponent;
  let fixture: ComponentFixture<BubbleGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BubbleGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BubbleGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

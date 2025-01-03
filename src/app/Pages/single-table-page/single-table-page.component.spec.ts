import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTablePageComponent } from './single-table-page.component';

describe('SingleTablePageComponent', () => {
  let component: SingleTablePageComponent;
  let fixture: ComponentFixture<SingleTablePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleTablePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleTablePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

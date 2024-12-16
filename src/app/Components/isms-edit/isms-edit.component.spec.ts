import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsEditComponent } from './isms-edit.component';

describe('IsmsEditComponent', () => {
  let component: IsmsEditComponent;
  let fixture: ComponentFixture<IsmsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsmsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IsmsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

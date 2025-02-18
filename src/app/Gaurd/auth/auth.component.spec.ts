import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthComponentSSO } from './auth.component';

describe('AuthComponent', () => {
  let component: AuthComponentSSO;
  let fixture: ComponentFixture<AuthComponentSSO>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthComponentSSO]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthComponentSSO);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../Services/auth.service';
import { LoginComponent } from './login.component';
import { provideHttpClient } from '@angular/common/http';

fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  function Setup(isValid: boolean) {
    const errorMessage = 'Invalid credentials';
    const loginResponse = { token: 'mockToken' };

    spyOn(authService, 'login').and.callFake((credentials) => {
      if (isValid) {
        return of(loginResponse);
      } else {
        return throwError(() => errorMessage);
      }
    });

    return { errorMessage, loginResponse };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        AuthService,
        provideHttpClient(),
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should validate email and password fields when email and password are entered in the form', () => {
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');

    emailControl?.setValue('');
    passwordControl?.setValue('');
    expect(component.loginForm.valid).toBeFalse();

    emailControl?.setValue('invalid-email');
    expect(component.loginForm.valid).toBeFalse();

    emailControl?.setValue('testmail@example.com');
    passwordControl?.setValue('password123');
    expect(component.loginForm.valid).toBeTrue();
  });

  it('should clear error message when there is no error in the credentials', () => {
    component.showError = true;
    component.errorMessage = 'Some error occurred';

    component.clearError();

    expect(component.showError).toBeFalse();
    expect(component.errorMessage).toBe('');
  });

  it('should not login when invalid credentials are submitted', () => {
    // const { loginResponse } = Setup(false);

    component.loginForm.setValue({ email: '', password: '' });
    component.onSubmit();

    expect(component.isLoading).toBeFalse();
  });

  it('should login when valid credentials are submitted', () => {
    const { loginResponse } = Setup(true);

    component.loginForm.setValue({
      email: 'testmail@example.com',
      password: 'validPass'
    });
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'testmail@example.com',
      password: 'validPass'
    });
    // expect(component.loginResponse).toBe(loginResponse);
    expect(component.isLoading).toBeFalse();
    expect(component.showError).toBeFalse();
  });

  it('should show error message when there is a login error', () => {
    const { errorMessage } = Setup(false);

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'invalidPass'
    });
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'invalidPass'
    });
    expect(component.showError).toBeTrue();
    expect(component.errorMessage).toBe(errorMessage);
    expect(component.isLoading).toBeFalse();
  });
});

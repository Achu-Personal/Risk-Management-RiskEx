import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { By } from '@angular/platform-browser';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test case to check if title is displayed correctly
  it('should display the correct title', () => {
    const mockData = { title: 'Test Navbar' };
    component.data = mockData;
    fixture.detectChanges();
    
    const titleElement: HTMLElement = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(titleElement.textContent).toBe(mockData.title);
  });

  // Test case for the toggleDropdown method
  it('should toggle dropdown visibility', () => {
    expect(component.showDropdown).toBeFalse();
    component.toggleDropdown();
    expect(component.showDropdown).toBeTrue();
    component.toggleDropdown();
    expect(component.showDropdown).toBeFalse();
  });

  // Test case for onChangePassword method
  it('should call onChangePassword when the method is triggered', () => {
    spyOn(window, 'alert'); // Spying on the alert method
    component.onChangePassword();
    expect(window.alert).toHaveBeenCalledWith('Change Password Clicked');
  });

  // Test case for onLogout method
  it('should call onLogout when the method is triggered', () => {
    spyOn(window, 'alert');
    component.onLogout();
    expect(window.alert).toHaveBeenCalledWith('Log Out Clicked');
  });
});

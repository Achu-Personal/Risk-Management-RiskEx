import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DropDownDeparmentComponent } from './drop-down-deparment.component';
import { ApiService } from '../../Services/api.service';
import { of, throwError } from 'rxjs';

const mockDepartments = [
  { id: 1, departmentName: 'Engineering' },
  { id: 2, departmentName: 'Marketing' }
];

describe('DropDownDeparmentComponent', () => {
  let component: DropDownDeparmentComponent;
  let fixture: ComponentFixture<DropDownDeparmentComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', ['getDepartment']);
    apiService.getDepartment.and.returnValue(of(mockDepartments));

    await TestBed.configureTestingModule({
      imports: [DropDownDeparmentComponent],
      providers: [{ provide: ApiService, useValue: apiService }]
    }).compileComponents();

    fixture = TestBed.createComponent(DropDownDeparmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load departments on init', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(apiService.getDepartment).toHaveBeenCalled();
    expect(component.departments).toEqual(mockDepartments);
  }));

  it('should handle API error', fakeAsync(() => {
    apiService.getDepartment.and.returnValue(throwError(() => 'API Error'));
    spyOn(console, 'error');

    component.loadDepartments();
    tick();

    expect(component.departments).toEqual([]);
    expect(console.error).toHaveBeenCalled();
  }));

  it('should select department and notify form control', () => {
    const mockOnChange = jasmine.createSpy('onChange');
    const mockOnTouched = jasmine.createSpy('onTouched');

    component.registerOnChange(mockOnChange);
    component.registerOnTouched(mockOnTouched);

    component.selectDepartment('Engineering');

    expect(component.selectedDepartment).toBe('Engineering');
    expect(mockOnChange).toHaveBeenCalledWith('Engineering');
    expect(mockOnTouched).toHaveBeenCalled();
    expect(component.dropdownOpen).toBeFalse();
  });

  it('should not select department when disabled', () => {
    component.setDisabledState(true);
    component.selectDepartment('Engineering');
    expect(component.selectedDepartment).toBe('');
  });

  it('should toggle dropdown when enabled', () => {
    component.toggleDropdown();
    expect(component.dropdownOpen).toBeTrue();

    component.toggleDropdown();
    expect(component.dropdownOpen).toBeFalse();
  });

  it('should not toggle dropdown when disabled', () => {
    component.setDisabledState(true);
    component.toggleDropdown();
    expect(component.dropdownOpen).toBeFalse();
  });

  it('should implement ControlValueAccessor methods', () => {
    component.writeValue('Engineering');
    expect(component.selectedDepartment).toBe('Engineering');

    component.writeValue('');
    expect(component.selectedDepartment).toBe('');
  });

  it('should close dropdown when clicking outside', () => {
    component.dropdownOpen = true;
    const mockEvent = new MouseEvent('click');

    document.dispatchEvent(mockEvent);
    expect(component.dropdownOpen).toBeFalse();
  });

  it('should track departments by id', () => {
    const department = mockDepartments[0];
    expect(component.trackByFn(0, department)).toBe(department.id);
  });
});

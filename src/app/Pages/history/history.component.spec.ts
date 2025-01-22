import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { delay, of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { HistoryComponent } from './history.component';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';
import { By } from '@angular/platform-browser';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockApiService = jasmine.createSpyObj('ApiService', [
      'gethistorytabledata',
      'getDepartmentHistoryTable',
      'getProjectHistroyTable',
    ]);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUserRole', 'getDepartmentId', 'getProjects']);

    await TestBed.configureTestingModule({
      imports: [HistoryComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ApiService, useValue: mockApiService },
        { provide: AuthService, useValue: mockAuthService },
        ChangeDetectorRef,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;

    // Setup mock returns
    mockAuthService.getUserRole.and.returnValue('Admin');
    mockAuthService.getDepartmentId.and.returnValue('1');
    mockAuthService.getProjects.and.returnValue([{ Id: 1 }, { Id: 2 }]);
    mockApiService.gethistorytabledata.and.returnValue(of([]));
    mockApiService.getDepartmentHistoryTable.and.returnValue(of([]));
    mockApiService.getProjectHistroyTable.and.returnValue(of([]));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should set roles correctly based on AuthService', () => {
      // Using assertions without deprecated toBeTrue/toBeFalse
      expect(component.isAdmin).toBe(true);
      expect(component.isDepartmentUser).toBe(false);
      expect(component.isProjectUser).toBe(false);
      expect(component.isEmtUser).toBe(false);
    });

    it('should prepare the project list correctly', () => {
      expect(component.projectList).toEqual([1, 2]);
    });

    it('should fetch all data for Admin', () => {
      expect(mockApiService.gethistorytabledata).toHaveBeenCalled();
      expect(component.isLoading).toBe(false);
      expect(component.items).toEqual([]);
    });
  });

  describe('data fetching', () => {
    it('should fetch data for Admin role', () => {
      component.isAdmin = true;
      component.fetchAllData(1);
      expect(mockApiService.gethistorytabledata).toHaveBeenCalledWith();
    });

    it('should fetch data for Department user', () => {
      component.isDepartmentUser = true;
      component.fetchAllData(1);
      expect(mockApiService.getDepartmentHistoryTable).toHaveBeenCalledWith(1);
    });

    it('should fetch data for Project user', () => {
      component.isProjectUser = true;
      component.projectList = [1, 2];
      component.fetchAllData(1);
      expect(mockApiService.getProjectHistroyTable).toHaveBeenCalledWith([1, 2]);
    });
  });

  describe('user interactions', () => {
    it('should navigate to view risk on row click', () => {
      const rowId = 5;
      component.OnClickRow(rowId);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/ViewRisk/5']);
    });

    it('should update date range when selected', () => {
      const dateRange = {
        startDate: '2025-01-01',
        endDate: '2025-01-07'
      };
      component.onDateRangeSelected(dateRange);
      expect(component.selectedDateRange).toEqual(dateRange);
    });

    // Testing async data loading state
    it('should show loading state while fetching data', (done) => {
      mockApiService.gethistorytabledata.and.returnValue(of([]).pipe(delay(100)));
      component.isAdmin = true;
      component.fetchAllData(1);

      expect(component.isLoading).toBe(true);

      setTimeout(() => {
        expect(component.isLoading).toBe(false);
        done();
      }, 150);
    });
  });

  // Testing template bindings
  describe('template bindings', () => {
    it('should update view when data changes', async () => {
      const mockData = [{ id: 1, name: 'Test Risk' }];
      mockApiService.gethistorytabledata.and.returnValue(of(mockData));

      component.isAdmin = true;
      await component.fetchAllData(1);
      fixture.detectChanges();

      const tableRows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(tableRows.length).toBeGreaterThan(0);
    });
  });
});

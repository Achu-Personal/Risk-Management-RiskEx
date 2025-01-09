import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['open']);
    
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: spy }
      ]
    });
    
    service = TestBed.inject(NotificationService);
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('success()', () => {
    it('should open snackbar with success message and correct configuration', () => {
      const message = 'Operation successful';
      
      service.success(message);

      expect(snackBar.open).toHaveBeenCalledWith(
        message, 
        'Close', 
        jasmine.objectContaining({
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        } as MatSnackBarConfig)
      );
      expect(snackBar.open).toHaveBeenCalledTimes(1);
    });

    it('should handle empty message', () => {
      service.success('');
      
      expect(snackBar.open).toHaveBeenCalledWith('', 'Close', jasmine.any(Object));
      expect(snackBar.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('error()', () => {
    it('should open snackbar with error message and correct configuration', () => {
      const message = 'Operation failed';
      
      service.error(message);

      expect(snackBar.open).toHaveBeenCalledWith(
        message, 
        'Close', 
        jasmine.objectContaining({
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        } as MatSnackBarConfig)
      );
      expect(snackBar.open).toHaveBeenCalledTimes(1);
    });

    it('should handle empty message', () => {
      service.error('');
      
      expect(snackBar.open).toHaveBeenCalledWith('', 'Close', jasmine.any(Object));
      expect(snackBar.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('info()', () => {
    it('should open snackbar with info message and correct configuration', () => {
      const message = 'Information message';
      
      service.info(message);

      expect(snackBar.open).toHaveBeenCalledWith(
        message, 
        'Close', 
        jasmine.objectContaining({
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['info-snackbar']
        } as MatSnackBarConfig)
      );
      expect(snackBar.open).toHaveBeenCalledTimes(1);
    });

    it('should handle empty message', () => {
      service.info('');
      
      expect(snackBar.open).toHaveBeenCalledWith('', 'Close', jasmine.any(Object));
      expect(snackBar.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('Common behavior', () => {
    it('should handle messages with special characters', () => {
      const message = 'Test @#$%^&*()';
      service.info(message);
      expect(snackBar.open).toHaveBeenCalledWith(message, 'Close', jasmine.any(Object));
    });

    it('should handle long messages', () => {
      const message = 'A'.repeat(1000);
      service.info(message);
      expect(snackBar.open).toHaveBeenCalledWith(message, 'Close', jasmine.any(Object));
    });

    it('should handle messages with HTML', () => {
      const message = '<strong>Test</strong>';
      service.info(message);
      expect(snackBar.open).toHaveBeenCalledWith(message, 'Close', jasmine.any(Object));
    });
  });
});

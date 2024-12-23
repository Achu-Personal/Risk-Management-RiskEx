import { TestBed } from '@angular/core/testing';

import { GlobalStateServiceService } from './global-state-service.service';

describe('GlobalStateServiceService', () => {
  let service: GlobalStateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalStateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

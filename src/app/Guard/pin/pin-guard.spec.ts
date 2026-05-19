import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { pinGuard } from './pin-guard';

describe('pinGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => pinGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

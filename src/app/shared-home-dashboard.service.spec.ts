import { TestBed } from '@angular/core/testing';

import { SharedHomeDashboardService } from './shared-home-dashboard.service';

describe('SharedHomeDashboardService', () => {
  let service: SharedHomeDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedHomeDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { IgracService } from './igrac.service';

describe('IgracService', () => {
  let service: IgracService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IgracService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

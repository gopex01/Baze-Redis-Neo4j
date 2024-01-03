import { TestBed } from '@angular/core/testing';

import { TurnirService } from './turnir.service';

describe('TurnirService', () => {
  let service: TurnirService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TurnirService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

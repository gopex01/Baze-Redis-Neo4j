import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimoviNaTurniruComponent } from './timovi-na-turniru.component';

describe('TimoviNaTurniruComponent', () => {
  let component: TimoviNaTurniruComponent;
  let fixture: ComponentFixture<TimoviNaTurniruComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimoviNaTurniruComponent]
    });
    fixture = TestBed.createComponent(TimoviNaTurniruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

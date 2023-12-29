import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnirComponent } from './turnir.component';

describe('TurnirComponent', () => {
  let component: TurnirComponent;
  let fixture: ComponentFixture<TurnirComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TurnirComponent]
    });
    fixture = TestBed.createComponent(TurnirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

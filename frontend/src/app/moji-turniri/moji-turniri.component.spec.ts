import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojiTurniriComponent } from './moji-turniri.component';

describe('MojiTurniriComponent', () => {
  let component: MojiTurniriComponent;
  let fixture: ComponentFixture<MojiTurniriComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MojiTurniriComponent]
    });
    fixture = TestBed.createComponent(MojiTurniriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

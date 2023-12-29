import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SviIgraciComponent } from './svi-igraci.component';

describe('SviIgraciComponent', () => {
  let component: SviIgraciComponent;
  let fixture: ComponentFixture<SviIgraciComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SviIgraciComponent],
    });
    fixture = TestBed.createComponent(SviIgraciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

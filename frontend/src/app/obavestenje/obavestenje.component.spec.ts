import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObavestenjeComponent } from './obavestenje.component';

describe('ObavestenjeComponent', () => {
  let component: ObavestenjeComponent;
  let fixture: ComponentFixture<ObavestenjeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ObavestenjeComponent]
    });
    fixture = TestBed.createComponent(ObavestenjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

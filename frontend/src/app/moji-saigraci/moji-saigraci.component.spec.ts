import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojiSaigraciComponent } from './moji-saigraci.component';

describe('MojiSaigraciComponent', () => {
  let component: MojiSaigraciComponent;
  let fixture: ComponentFixture<MojiSaigraciComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MojiSaigraciComponent]
    });
    fixture = TestBed.createComponent(MojiSaigraciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

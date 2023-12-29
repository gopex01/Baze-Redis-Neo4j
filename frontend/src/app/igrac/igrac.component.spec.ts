import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IgracComponent } from './igrac.component';

describe('IgracComponent', () => {
  let component: IgracComponent;
  let fixture: ComponentFixture<IgracComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IgracComponent]
    });
    fixture = TestBed.createComponent(IgracComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IgraciNaTurniruComponent } from './igraci-na-turniru.component';

describe('IgraciNaTurniruComponent', () => {
  let component: IgraciNaTurniruComponent;
  let fixture: ComponentFixture<IgraciNaTurniruComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IgraciNaTurniruComponent]
    });
    fixture = TestBed.createComponent(IgraciNaTurniruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

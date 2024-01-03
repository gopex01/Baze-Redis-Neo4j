import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KreiranjeTurniraComponent } from './kreiranje-turnira.component';

describe('KreiranjeTurniraComponent', () => {
  let component: KreiranjeTurniraComponent;
  let fixture: ComponentFixture<KreiranjeTurniraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KreiranjeTurniraComponent]
    });
    fixture = TestBed.createComponent(KreiranjeTurniraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationPopupComponent } from './registration-popup.component';

describe('RegistrationPopupComponent', () => {
  let component: RegistrationPopupComponent;
  let fixture: ComponentFixture<RegistrationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseBetPopupComponent } from './raise-bet-popup.component';

describe('RaiseBetPopupComponent', () => {
  let component: RaiseBetPopupComponent;
  let fixture: ComponentFixture<RaiseBetPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaiseBetPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaiseBetPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

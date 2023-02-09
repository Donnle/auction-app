import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
      ],
      providers: [
        { provide: UserService, useValue: jasmine.createSpyObj(['userData$']) },
        { provide: AuthService, useValue: jasmine.createSpyObj(['isUserAuthorized$']) },
        { provide: NgxSmartModalService, useValue: jasmine.createSpyObj(['']) },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('function handleOpenMenu should work', () => {
    component.handleOpenMenu();
    expect(component.isMenuOpened).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

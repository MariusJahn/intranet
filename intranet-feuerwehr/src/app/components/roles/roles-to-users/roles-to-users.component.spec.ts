import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesToUsersComponent } from './roles-to-users.component';

describe('RolesToUsersComponent', () => {
  let component: RolesToUsersComponent;
  let fixture: ComponentFixture<RolesToUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolesToUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesToUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

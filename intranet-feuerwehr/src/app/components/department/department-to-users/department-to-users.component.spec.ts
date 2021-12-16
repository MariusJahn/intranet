import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentToUsersComponent } from './department-to-users.component';

describe('DepartmentToUsersComponent', () => {
  let component: DepartmentToUsersComponent;
  let fixture: ComponentFixture<DepartmentToUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentToUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentToUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

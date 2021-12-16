import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightsToRolesComponent } from './rights-to-roles.component';

describe('RightsToRolesComponent', () => {
  let component: RightsToRolesComponent;
  let fixture: ComponentFixture<RightsToRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightsToRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightsToRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

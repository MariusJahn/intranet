import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WholeNewsEntryComponent } from './whole-news-entry.component';

describe('WholeNewsEntryComponent', () => {
  let component: WholeNewsEntryComponent;
  let fixture: ComponentFixture<WholeNewsEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WholeNewsEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WholeNewsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

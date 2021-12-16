import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewsfeedComponent } from './create-newsfeed.component';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient, HttpClientModule} from "@angular/common/http";

describe('CreateNewsfeedComponent', () => {
  let component: CreateNewsfeedComponent;
  let fixture: ComponentFixture<CreateNewsfeedComponent>;

  let httpMock: HttpTestingController;
  let httpClient: HttpClientModule;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewsfeedComponent ],
      imports:[HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewsfeedComponent);
    component = fixture.componentInstance;

    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

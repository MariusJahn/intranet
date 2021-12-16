import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsfeedComponent } from './newsfeed.component';
import {NewsfeedRepository} from "./repositories/newsfeed.repository";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient, HttpClientModule} from "@angular/common/http";


describe('NewsfeedComponent', () => {
  let component: NewsfeedComponent;
  let fixture: ComponentFixture<NewsfeedComponent>;

  let httpMock: HttpTestingController;
  let httpClient: HttpClientModule;

  let stub: Partial<NewsfeedRepository>;
  let newsfeedRepository: NewsfeedRepository;





  beforeEach(async(() => {

    stub = {};

    TestBed.configureTestingModule({
      declarations: [ NewsfeedComponent ],
      imports:[HttpClientTestingModule],
      providers: [ { provide: NewsfeedRepository, useValue: stub } ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NewsfeedComponent);
    component = fixture.componentInstance;

    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);

    newsfeedRepository = TestBed.inject(NewsfeedRepository);


  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});


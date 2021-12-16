import { TestBed } from '@angular/core/testing';

import { NewsfeedRepository } from "./newsfeed.repository";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient, HttpClientModule} from "@angular/common/http";

describe('NewsfeedService', () => {
  let service: NewsfeedRepository;

  let httpMock: HttpTestingController;
  let httpClient: HttpClientModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientTestingModule],
      providers: [NewsfeedRepository]
    });
    service = TestBed.inject(NewsfeedRepository);
    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

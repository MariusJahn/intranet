import { TestBed } from '@angular/core/testing';

import { QuicklinksService } from './quicklinks.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient, HttpClientModule} from "@angular/common/http";

describe('QuicklinksService', () => {
  let service: QuicklinksService;

  let httpMock: HttpTestingController;
  let httpClient: HttpClientModule;

  beforeEach(() => {
    TestBed.configureTestingModule({imports:[HttpClientTestingModule]});
    service = TestBed.inject(QuicklinksService);

    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

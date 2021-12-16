import { TestBed } from '@angular/core/testing';

import { RolesService } from './roles.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient, HttpClientModule} from "@angular/common/http";

describe('RollenService', () => {
  let service: RolesService;

  let httpMock: HttpTestingController;
  let httpClient: HttpClientModule;


  beforeEach(() => {
    TestBed.configureTestingModule({imports:[HttpClientTestingModule]});
    service = TestBed.inject(RolesService);

    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

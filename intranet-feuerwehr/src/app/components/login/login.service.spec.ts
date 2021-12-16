import { TestBed } from '@angular/core/testing';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { LoginService } from './login.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Test} from "tslint";

describe('LoginService', () => {
  let service: LoginService;

  let httpMock: HttpTestingController;
  let httpClient: HttpClientModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations:[],
      imports:[HttpClientTestingModule],
      providers:[LoginService]
    });
    service = TestBed.inject(LoginService);

    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


});

import { TestBed } from '@angular/core/testing';

import { FileUploadService } from './file-upload.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient, HttpClientModule} from "@angular/common/http";

describe('FileUploadService', () => {
  let service: FileUploadService;

  // Bereitstellen von HTTP in der Testumgebung
  let httpMock: HttpTestingController;
  let httpClient: HttpClientModule;

  beforeEach(() => {
    TestBed.configureTestingModule({imports:[HttpClientTestingModule]});
    service = TestBed.inject(FileUploadService);

    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

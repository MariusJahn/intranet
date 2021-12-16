import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileComponent } from './upload-file.component';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient, HttpClientModule} from "@angular/common/http";

describe('UploadFileComponent', () => {
  let component: UploadFileComponent;
  let fixture: ComponentFixture<UploadFileComponent>;

  // Bereitstellen von HTTP in der Testumgebung
  let httpMock: HttpTestingController;
  let httpClient: HttpClientModule;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFileComponent ],
      imports:[HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileComponent);
    component = fixture.componentInstance;

    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

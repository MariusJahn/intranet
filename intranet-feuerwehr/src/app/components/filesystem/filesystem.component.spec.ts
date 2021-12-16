import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesystemComponent } from './filesystem.component';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClientModule} from "@angular/common/http";

describe('FilesystemComponent', () => {
  let component: FilesystemComponent;
  let fixture: ComponentFixture<FilesystemComponent>;

  // Bereitstellen von HTTP in der Testumgebung
  let httpMock: HttpTestingController;
  let httpClient: HttpClientModule;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesystemComponent ],
      imports:[HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesystemComponent);
    component = fixture.componentInstance;

    // Bereitstellen von HTTP in der Testumgebung
    let httpMock: HttpTestingController;
    let httpClient: HttpClientModule;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

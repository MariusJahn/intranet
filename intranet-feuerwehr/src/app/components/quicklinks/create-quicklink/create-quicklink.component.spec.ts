import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuicklinkComponent } from './create-quicklink.component';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ToastrModule, ToastrService} from "ngx-toastr";

describe('CreateQuicklinkComponent', () => {
  let component: CreateQuicklinkComponent;
  let fixture: ComponentFixture<CreateQuicklinkComponent>;

  let httpMock: HttpTestingController;
  let httpClient: HttpClientModule;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateQuicklinkComponent ],
      imports:[HttpClientTestingModule, ToastrModule.forRoot()],
      providers:[
        {provide: ToastrService, useClass: ToastrService} //provider für Toast
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQuicklinkComponent);
    component = fixture.componentInstance;

    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);

    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

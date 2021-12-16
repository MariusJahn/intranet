import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuicklinksComponent } from './quicklinks.component';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {of} from "rxjs";
import {ToastrModule, ToastrService} from "ngx-toastr";
import {QuicklinksService} from "./quicklinks.service";
import {Quicklink} from "./quicklink";
import {CreateQuicklinkComponent} from "./create-quicklink/create-quicklink.component";
import {Component} from "@angular/core";

//Mockklasse für den Matdialog
export class MatDialogMock {
  // When the component calls this.dialog.open(...) we'll return an object
  // with an afterClosed method that allows to subscribe to the dialog result observable.
  open() {
    return {
      afterClosed: () => of({action: true})
    };
  }
}

describe('QuicklinksComponent', () => {
  let component: QuicklinksComponent;
  let fixture: ComponentFixture<QuicklinksComponent>;

  // Bereitstellen von HTTP in der Testumgebung
  let httpMock: HttpTestingController;
  let httpClient: HttpClientModule;

  let quicklinksService: QuicklinksService;

  let testquicklinks = [{
      quicklinkID: 1,
      name: "google",
      href: "http://google.de"
    },
    /*{
      quicklinkID: 2,
      name: "amazon",
      href: "http://amazon.de"
    }*/
  ]



  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuicklinksComponent],
      imports:[HttpClientTestingModule, ToastrModule.forRoot()],
      providers:[QuicklinksService,
        {provide: MatDialog, useClass: MatDialogMock}, //provider für MatDialog
        {provide: ToastrService, useClass: ToastrService} //provider für Toast
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuicklinksComponent);
    component = fixture.componentInstance;

    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);

    quicklinksService = TestBed.inject(QuicklinksService);


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title "Quicklinks"' ,() => {
    let p = fixture.nativeElement.querySelector('p');
    expect(p.textContent).toContain("Quicklinks")
  })

  it('should have a different title "test"' ,() => {
    let p = fixture.nativeElement.querySelector('p');
    p.textContent = "test";
    fixture.detectChanges();
    expect(p.textContent).toContain("test")
  })


  it("should have no quicklinks in the beginning", () => {
    component.ngOnInit();

    expect(component.quicklinks.length).toBe(0);
  })

  /*it("Quicklink was deleted", () => {
    component.quicklinks = [{
      quicklinkID: 1,
      name: "google",
      href: "http://google.de"
    }]

    component.deleteQuicklink(component.quicklinks[0]);
    expect(component.quicklinks.length).toBe(0);
  })*/



});

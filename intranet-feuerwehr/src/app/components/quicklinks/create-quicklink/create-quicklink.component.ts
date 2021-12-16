import { Component, OnInit } from '@angular/core';
import {Quicklink} from "../quicklink";
import {QuicklinksService} from "../quicklinks.service";
import {MessageToastrService} from "../../MessageService/message-toastr.service";
import {error} from "@angular/compiler/src/util";

@Component({
  selector: 'app-create-quicklink',
  templateUrl: './create-quicklink.component.html',
  styleUrls: ['./create-quicklink.component.css']
})
export class CreateQuicklinkComponent implements OnInit {

  constructor(private quicklinkservice: QuicklinksService,
              private toastService: MessageToastrService) { }

  ngOnInit(): void {
  }

  // Variable für einen Namen, falls Link hinzugefügt wird
  public newName: string;

  // Variable für URL, falls Link hinzugefügt wird
  public newHref: string;

  //Variable für den MessageService, Erfolgreich oder Nicht
  public entryAdded: boolean;

  // Methode, um einen neuen Link hinzuzufügen
  public confirm(): void {

    // Name ist leer oder undefined also wird kein Quicklink erstellt
    if(this.newName == '' || this.newName == undefined) {
      this.toastService.showToastr('Es wurde kein Name eingegeben.', 'Name fehlt', 'error');
    }
    // URL ist leer oder undefined also wird kein Quicklink erstellt
    else if(this.newHref == '' || this.newHref == undefined) {
      this.toastService.showToastr('Es wurde kein Link eingegeben.', 'Link fehlt', 'error');
    }
    // neuer Link wird dem Array hinzugefügt und die Liste wird aktualisiert
    else {
      const newLink: Quicklink = {
        quicklinkID: 0,
        name: this.newName,
        href: this.newHref,
      };
      this.quicklinkservice.addQuicklink(newLink).subscribe(res => {

        this.entryAdded = true;
        this.toastService.showToastr('Quicklink wurde hinzugefügt.', 'Erstellen erfolgreich', 'success');
        window.location.reload();
      }, err => {
        this.toastService.showToastr('Quicklink konnte nicht hinzugefügt werden (Doppelter Name/Link)?.', 'Erstellen fehlgeschlagen', 'error');
      });
    }
  }

}

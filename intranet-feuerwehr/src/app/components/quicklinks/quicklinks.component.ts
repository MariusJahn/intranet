import { Component, OnInit } from '@angular/core';
import {QuicklinksService} from './quicklinks.service';
import {Quicklink} from './quicklink';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {CreateNewsfeedComponent} from "../newsfeed/create-newsfeed/create-newsfeed.component";
import {CreateQuicklinkComponent} from "./create-quicklink/create-quicklink.component";
import {MessageToastrService} from "../MessageService/message-toastr.service";
import {Observable} from "rxjs";
import {AuthService} from "../auth/services/auth.service";
import {AuthorizationService} from "../auth/services/authorization.service";

@Component({
  selector: 'app-quicklinks',
  templateUrl: './quicklinks.component.html',
  styleUrls: ['./quicklinks.component.css']
})

export class QuicklinksComponent implements OnInit {

  // Array für alle Links in Datenbank
  public quicklinks: Array<Quicklink>;

  // Variable für einen Namen, falls Link hinzugefügt wird
  public newName: string;

  // Variable für URL, falls Link hinzugefügt wird
  public newHref: string;

  // Variable die aus JWT Session belegt wird ob User Admin ist
  public isAdmin: boolean;
  public tempIsAdmin: Observable<boolean> = this.isUserAdmin(); //Hilfsvariable für isAdmin, damit sie immer neu belegt wird und abfragt

  // Variable die aus JWT Session belegt wird ob User Recht hat Quicklinks zu schreiben
  public allowWriteQuicklink: boolean;
  public tempAllowWriteQuicklink: Observable<boolean> = this.allowWriteQuicklinks();

  constructor(private quicklinkservice: QuicklinksService,
              private dialog: MatDialog,
              private toastService: MessageToastrService,
              private authService: AuthService,
              private authorization: AuthorizationService) { }

  // Array der Links aus Datenbank geholt
  async ngOnInit() {

    this.quicklinks = [];
    this.quicklinkservice.getQuicklink().subscribe((quicklinks: Quicklink[]) => {
      this.quicklinks = quicklinks;
    });

    // Belege allowWriteQuicklink vom Observable<boolean>
    try {
      this.allowWriteQuicklink = await this.tempAllowWriteQuicklink.toPromise();
    } catch (e) {
      this.allowWriteQuicklink = false;
    }

    // Belege isAdmin vom Observable<boolean>
    try {
      this.isAdmin = await this.tempIsAdmin.toPromise();
    } catch (e) {
      this.isAdmin = false;
    }
  }

  isUserAdmin(): Observable<boolean> {
    return this.authService.isAdmin();
  }

  // RightID 9 = Das Recht die Quicklinks zu verwalten, Frage nach Recht Schreiben
  allowWriteQuicklinks(): Observable<boolean> {
    return this.authorization.hasUserPermission(9, "allowWrite");
  }

  // Methode, um einen Link zu löschen
  public deleteQuicklink(quicklink: Quicklink): void {
    if(confirm('Möchten Sie diesen Link wirklich löschen?')) {
      this.quicklinkservice.deleteEntry(quicklink).subscribe((deletedQuicklink: Quicklink) => {
        this.quicklinkservice.getQuicklink().subscribe((quicklinks: Array<Quicklink>) => {
          this.quicklinks = quicklinks;
          this.toastService.showToastr('Quicklink wurde gelöscht.', 'Löschen erfolgreich', 'success');;
        });
      });
    }

  }
  // Methode, um dem Link zu folgen
  public navigateTo(link: string): void {
    window.open(link);
  }

  // Button neue News, Dialog mit CreateQuicklinkComponent gefüllt.
  createQuicklinkDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false //Klicken außerhalb lässt Fenster schließen.
    this.dialog.open(CreateQuicklinkComponent, dialogConfig);
  }

}

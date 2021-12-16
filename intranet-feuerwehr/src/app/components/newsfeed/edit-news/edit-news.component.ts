import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NewsfeedService } from '../newsfeed.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageToastrService } from '../../MessageService/message-toastr.service';
import { User } from '../../user/interfaces/User';
import { News } from '../types/News';
import { AuthService } from '../../auth/services/auth.service';
import { NewsfeedRepository } from '../repositories/newsfeed.repository';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-edit-news',
  templateUrl: './edit-news.component.html',
  styleUrls: ['./edit-news.component.css']
})
export class EditNewsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Use ViewChild um auf html inpute typ file zuzugreifen, siehe im html-tag #imageInput
  @ViewChild('imageInput')
  //imageInputVariable: ElementRef;
  obs: Observable<any>;
  dataSource: MatTableDataSource<News>;
  public entryAdded: boolean;

  public newTitel: string;

  public newText: string;

  public newWholeEntry: string;

  public newPictureURL: string;

  public newShowWholeEntry: boolean;

  // Aus UserID ( JWT ) Abfragen ob zugewiesene Rolle, passendes Recht besitzt!
  public newsfeedRight = true;

  public selectedPicture: File;

  constructor(private newsfeedRepository: NewsfeedRepository,
              private newsfeedService: NewsfeedService,
              private authService: AuthService,
              private toastService: MessageToastrService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }


  // Wenn auf Button "News hinzufügen" geklickt wird, wird News hinzugefügt und an den alten "Drangehangen" durch erneutes ausgeben der news
  public confirm(): void {
    // Wenn direkt leerer erstellt wird, ist undefined
    if(typeof this.data.Titel !== 'undefined' && typeof  this.data.Beschreibung !== 'undefined') {
      // Wenn vorher eine News erstellt wurde,ist nicht mehr undefined da variablen einmal belegt wurden!, wenn jetzt leere news ist sie ""
      if(this.data.Titel !== "" && this.data.Beschreibung !== "") {

        // News vorher erzeugen ohne pictureDataURL, MitarbeiterID und author, da sonst probleme im .subscribe an Daten zu kommen
        const newNews: News = {
          newsfeedID: this.data.ID,
          author: this.data.Autor,
          // LocaleString Datum mit Uhrzeit. Ohne Uhrzeit einfach toLocaleDateString()
          createdDate: this.data.Date,
          title: this.data.Titel,
          descriptiontext: this.data.Beschreibung,
          wholeEntry: this.data.WholeEntry,
          pictureDataUrl: this.data.URL,
          showWholeEntry: this.data.ShowWholeEntry
        };

        // Ist Bild angehangen?
        if (this.selectedPicture !== undefined) {
          // Belege pictureURL durch uploadImage, wenn Bild hinzugefügt ist in NewsfeedEditor
          this.newsfeedService.uploadImage(this.selectedPicture).subscribe(res => {
            // Image url aus Json response ziehen (siehe backend)
            this.newPictureURL = res.imagePath;
            // newNews pictureURL wird belegt, da Bild ausgewählt ist. Danach wird News hinzugefügt und alle news werden ausgegeben.
            newNews.pictureDataUrl = this.newPictureURL;
            // Hole User Object aus JWT Für Author
            this.authService.getUserByJWT().subscribe((response: User) => {
              const name = response[0].Vorname;
              const lastname = response[0].Nachname;
              const author = name + ' ' + lastname;
              newNews.author = author;
              this.newsfeedService.addEntry(newNews).subscribe(() => {
                this.entryAdded = true;
                this.toastService.showToastr("Neuer Newsfeedbeitrag wurde hinzugefügt", "Erstellung erfolgreich", "success");
                window.location.reload();
              });
            });
          });
        } else {
          // Kein Bild angehangen, news mit leerem pictureDataURL hinzufügen + Autor
          // Hole User Object aus JWT Für Author
          this.authService.getUserByJWT().subscribe((response: User) => {
            const name = response[0].Vorname;
            const lastname = response[0].Nachname;
            const author = name + ' ' + lastname;
            newNews.author = author;
            this.newsfeedService.editEntry(newNews).subscribe(() => {
              this.entryAdded = true;
              this.toastService.showToastr("Neuer Newsfeedbeitrag wurde bearbeitet", "Bearbeitung erfolgreich", "success");
              window.location.reload();
            });
          });
        }
      } else {
        this.sendErrorMessage();
      }
    }
    else {
      this.sendErrorMessage();
    }
  }

  public sendErrorMessage() {
    this.toastService.showToastr('Newsfeedbeitrag konnte nicht erstellt werden.', 'Erstellung fehlgeschlagen', 'error');

    this.entryAdded = false;
  }

  // Belegt selectedPicture vom typ file, wenn ein Bild hinzugefügt worden ist, nötig für confirm()
  public selectPicture(event: any): void {
    this.selectedPicture = event.target.files[0]; //File aus event. hier only png and jpg
    event.preventDefault();
  }

  public imageInputClicked() {
    document.getElementById("image-upload").click();
  }

  leaveEditMode() {
    this.toastService.showToastr('Alle Änderungen wurden verworfen.', 'Bearbeiten abgebrochen', 'warning');
  }

}

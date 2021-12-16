import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {News} from "../types/News";
import {MatTableDataSource} from "@angular/material/table";
import {NewsfeedRepository} from "../repositories/newsfeed.repository";
import {NewsfeedService} from "../newsfeed.service";
import {AuthService} from "../../auth/services/auth.service";
import {MessageToastrService} from "../../MessageService/message-toastr.service";
import {MatPaginator} from "@angular/material/paginator";
import {Observable} from "rxjs";
import {User} from "../../user/interfaces/User";

@Component({
  selector: 'app-create-newsfeed',
  templateUrl: './create-newsfeed.component.html',
  styleUrls: ['./create-newsfeed.component.css']
})
export class CreateNewsfeedComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Use ViewChild um auf html inpute typ file zuzugreifen, siehe im html-tag #imageInput
  @ViewChild('imageInput')
  imageInputVariable: ElementRef;
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
              private toastService: MessageToastrService
              ) { }

  ngOnInit(): void {
  }


  // Wenn auf Button "News hinzufügen" geklickt wird, wird News hinzugefügt und an den alten "Drangehangen" durch erneutes ausgeben der news
  public confirm(): void {
    // Wenn direkt leerer erstellt wird, ist undefined
    if(typeof this.newTitel !== 'undefined' && typeof  this.newText !== 'undefined') {
      // Wenn vorher eine News erstellt wurde,ist nicht mehr undefined da variablen einmal belegt wurden!, wenn jetzt leere news ist sie ""
      if(this.newTitel !== "" && this.newText !== "") {

        // News vorher erzeugen ohne pictureDataURL, MitarbeiterID und author, da sonst probleme im .subscribe an Daten zu kommen
        const newNews: News = {
          newsfeedID: 0,
          author: '',
          // LocaleString Datum mit Uhrzeit. Ohne Uhrzeit einfach toLocaleDateString()
          createdDate: new Date().toLocaleString([], {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}),
          title: this.newTitel,
          descriptiontext: this.newText,
          wholeEntry: this.newWholeEntry,
          pictureDataUrl: '',
          showWholeEntry: this.newShowWholeEntry ? 1 : 0
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
                this.toastService.showToastr("Erstellung erfolgreich", "Neuer Newsfeedbeitrag wurde hinzugefügt", "success");
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
            this.newsfeedService.addEntry(newNews).subscribe(() => {
              this.entryAdded = true;
              this.toastService.showToastr("Erstellung erfolgreich", "Neuer Newsfeedbeitrag wurde hinzugefügt", "success");
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
  // Setzt Input vom File zurück, wenn news mit Bild hinzugefügt wurden.
  resetImage() {
    this.imageInputVariable.nativeElement.value = '';
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

  leaveCreateMode() {
    this.toastService.showToastr('Es wurde kein Newsfeedbeitrag erstellt.', 'Erstellung abgebrochen', 'warning');
  }

}



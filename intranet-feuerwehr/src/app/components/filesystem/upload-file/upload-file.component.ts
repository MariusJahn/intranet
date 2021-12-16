import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormsModule} from "@angular/forms";
import {FileUploadService} from "./file-upload.service";
import {Document} from "../types/Document";
import {MessageToastrService } from "../../MessageService/message-toastr.service";
import {FileService} from "../file.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FilesystemComponent} from "../filesystem.component";
import {DocumentUpdate} from "../types/DocumentUpdate";
import {SelectDepartment} from "../types/SelectDepartment";
import {AuthorizationService} from "../../auth/services/authorization.service";
import {NewsfeedService} from "../../newsfeed/newsfeed.service";
import {User} from "../../user/interfaces/User";
import {AuthService} from "../../auth/services/auth.service";



@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {


  public parent: string;
  public parentOptions = this.data.titles; // Optionen für Vorgänger auswählen
  public filteredList = this.parentOptions.slice(); // Optionen, die angezeigt werden, wenn gesucht wird

  public selectedFile: File;

  userDepartment: SelectDepartment[] = [];
  // Besitzt Abteilung die im Select ausgewählt ist
  categoryFormControl: FormControl = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<FilesystemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fileUploadService: FileUploadService,
    private toastService: MessageToastrService,
    private fileService: FileService,
    private authorization: AuthorizationService,
    private newsfeedService: NewsfeedService,
    private authService: AuthService)
    { }


  ngOnInit(): void {
    // Wichtig: Erst Abteilungen belegen
    this.getUserDepartment();
  }

  /**
   * Belege userDepartment aus jwt Abteilungen
   */

  getUserDepartment() {
    this.authorization.getDepartmentsFromJWT().subscribe((departmentResponse) => {

      // Diese Kategorien sind automatisch bei jeden Nutzer, sind nicht als Abteilungen in DB eingetragen
      const daType: SelectDepartment = {
        value: 'da',
        name: 'Dienstliche Anweisungen'
      }
      const dbType: SelectDepartment = {
        value: 'db',
        name: 'Dienstliche Bekanntmachungen'
      }
      const allType: SelectDepartment = {
        value: 'all',
        name: 'Für alle'
      }
      this.userDepartment.push(daType);
      this.userDepartment.push(dbType);
      this.userDepartment.push(allType);

      // Individuellen Abteilungen ins userDepartment hinzufügen, besteht aus ID und name aus Abteilung, daher toString

      for (let i = 0; i < departmentResponse.allDepartment.length; i++) {
        const newCategory: SelectDepartment = {
          value: departmentResponse.allDepartment[i].departmentID,
          name: departmentResponse.allDepartment[i].name
        }
        this.userDepartment.push(newCategory);
      }
    });
  }

  public selectFile(event: any): void {
    this.selectedFile = event.target.files[0]; //File aus event

  }

  /**
   * Checkt aus hinzugefügten Dokument, ob Name bereits in Datenbank ( all Titles ) hinterlegt ist.
   */

  public isNameAlreadyUsed(): boolean {

    var i = 0;
    var nameIsAlreadyUsed = false;
    while(!nameIsAlreadyUsed && i < this.data.titles.length) {
      if (this.data.titles[i] === this.selectedFile.name) {
        nameIsAlreadyUsed = true;
      }
      i++;
    }
    return nameIsAlreadyUsed;
  }

  /**
   * Sendet ausgewähltes Dokument in die Datenbank
   * @param event
   */
  uploadFile(event) {

    //Wenn das Dokument eine Dienstliche Anweisung ist, wird ein Newsfeedeintrag dafür erstellt.
    if(this.data.category.value == "da") {
      this.authService.getUserByJWT().subscribe((response: User) => {
        const name = response[0].Vorname;
        const lastname = response[0].Nachname;
        const author = name + ' ' + lastname;

        this.newsfeedService.addEntry(
          {
            newsfeedID: 0,
            author: author,
            createdDate: new Date().toLocaleString([], {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}),
            title: "Es gibt eine neue Dienstliche Anweisung!",
            descriptiontext: "",
            wholeEntry: "",
            pictureDataUrl: "",
            showWholeEntry: 0
          }
        ).subscribe();
      });
    }

    //Wenn das Dokument eine Dienstliche Bekanntmachung ist, wird ein Newsfeedeintrag dafür erstellt.
    if(this.data.category.value == "db") {
      this.authService.getUserByJWT().subscribe((response: User) => {
        const name = response[0].Vorname;
        const lastname = response[0].Nachname;
        const author = name + ' ' + lastname;

        this.newsfeedService.addEntry(
          {
            newsfeedID: 0,
            author: author,
            createdDate: new Date().toLocaleString([], {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}),
            title: "Es gibt eine neue Dienstliche Bekanntmachung!",
            descriptiontext: "",
            wholeEntry: "",
            pictureDataUrl: "",
            showWholeEntry: 0
          }
        ).subscribe();

      });
    }

    event.preventDefault();
    if(this.parent === undefined || this.parent === null) {
      this.parent = '';
    }


    if(this.selectedFile === undefined) {
      this.toastService.showToastr('Es wurde kein Dokument ausgewählt.', 'Hochladen fehlgeschlagen', 'error');
    } else if(this.isNameAlreadyUsed()) {
      this.toastService.showToastr('Benennen Sie das Dokument um.', 'Der Titel existiert bereits.', 'error');
    } else {
      // FormData Objekt nötig, um File ans Backend zu übergeben und auszuwerten mit Multer
      const formDataDocument = new FormData();
      // FormData belegen für Backend + datenbanktabelle
      formDataDocument.append('title', this.selectedFile.name);
      formDataDocument.append('validity', '1'); // Im backend 1 oder 0
      formDataDocument.append('category', this.data.category.value);
      formDataDocument.append('parent', this.parent);
      formDataDocument.append('document', this.selectedFile, this.selectedFile.name); // belege Blob


      var doc: DocumentUpdate = {
        documentID: undefined,
        validity: 0,
        parent: this.parent,
      };

      if(this.parent !== '') {
        this.fileService.putValidityInvalid(doc).subscribe();
      }

      // Neues Document and Service übergeben, zum Backend.
      this.fileUploadService.uploadDocument(formDataDocument).subscribe(response => {
        if (!response) {
          this.toastService.showToastr('Dateityp nicht zulässig.', 'Hochladen fehlgeschlagen.', 'error');
        } else {
          this.toastService.showToastr('Dokument wurde hochgeladen.', 'Hochladen erfolgreich', 'success');
        }
      });
    }
  }

  public fileInputClicked() {
    document.getElementById("fileUpload").click();
  }

  /**
   * create Document abbrechen
   */

  leaveCreateDocument() {
    this.toastService.showToastr('Es wurde kein Dokument hochgeladen.', 'Hochladen abgebrochen', 'warning');
  }

}

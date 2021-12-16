import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {FileService} from "./file.service";
import {Document} from "./types/Document";
import {DocumentTable} from "./types/DocumentTable";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {UploadFileComponent} from "./upload-file/upload-file.component";
import {EditFileComponent} from "./edit-file/edit-file.component"

import * as fileSaver from 'file-saver';
import {SelectDepartment} from "./types/SelectDepartment";
import {FormControl} from "@angular/forms";
import {AuthorizationService} from "../auth/services/authorization.service";





@Component({
  selector: 'app-filesystem',
  templateUrl: './filesystem.component.html',
  styleUrls: ['./filesystem.component.css']
})
export class FilesystemComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Document>;

  public tooltipPosition = "above";

  constructor(private fileService: FileService, private dialog: MatDialog, private authorization: AuthorizationService) {
  }


  id: number; // Nummer der Zeile speichern, die wir bearbeiten wollen (Edit Mode)
  searchKey: string; // Suchbegriff
  data: Document[] = []; // alle Dokumente aus der Kategorie "" original aus der Datenbank
  dataTable: DocumentTable[] = []; // Alle Dokumente optisch angepasst
  docDataSource; // Daten in der Mat Table
  displayedColumns = ['title', 'validity', 'creationDate', 'alterationDate', 'parent', 'actions']; // Spalten in der Mat Table

  userDepartment: SelectDepartment[] = [];
  // Besitzt Abteilung die im Select ausgewählt ist
  categoryFormControl: FormControl = new FormControl();


  /**
   * beim Refresh der Seite die Tabelle aktualisieren
   */
  ngOnInit(): void {

    /*// Eigene Sortiermethode für MatTable
    this.docDataSource = new MatTableDataSource(this.dataTable);
    console.log("1");
    this.docDataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => {
      console.log("2");
      const value: any = data[sortHeaderId];
      console.log("3");
      return typeof value === "string"
        ? value.toLowerCase()
        : value;
    };*/

    // Wenn keine Kategorie ausgewählt (neu in Dokumentenverwaltung geklickt) Dienstliche Anweisungen auf Standart
    if (this.categoryFormControl.value === null) {
      this.categoryFormControl.setValue('da')
    }


    // Wichtig: Erst Abteilungen belegen
    this.getUserDepartment();

    // Dann Documente laden.
    this.getDocumentTable();

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


  /**
   * wenn die Kategorie geändert wird, wird eine neue Tabelle geladen
   */

  updateTable() {
    this.dataTable = [];
    this.getDocumentTable();
  }

  /**
   * aktuelle Tabelle aus der Datenbank holen
   * Daten parsen (vorerst nur Datum) zum Darstellen in der Tabelle
   * Daten der Tabelle, Paginator und sortieren setzen
   */

  getDocumentTable() {
    this.fileService.getDocuments(this.categoryFormControl.value).subscribe(res => {
      this.data = res;
      this.fileService.parseDataIntoTable(this.data, this.dataTable, this.paginator);
      this.docDataSource = new MatTableDataSource(this.dataTable);
      this.docDataSource.paginator = this.paginator;
      this.docDataSource.sort = this.sort;
    });
  }

  /**
   * Tabelle anhand des Suchwortes filtern
   * Eventuell Teile neu parsen
   * @param event beim Eingeben jedes Buchstaben neu
   */

  applyFilter(event: Event) {
    this.docDataSource.filterPredicate = (data:
                                            { title: string }, filterValue: string) =>
      data.title.trim().toLowerCase().indexOf(filterValue) !== -1;
    const filterValue = (event.target as HTMLInputElement).value;
    this.docDataSource.filter = filterValue.trim().toLowerCase();
    let filteredData: DocumentTable[];
    filteredData = this.docDataSource.filteredData;
    if (filteredData.length > 0) {
      this.fileService.parseDataIntoTable(this.data, this.dataTable, this.paginator);
    }
  }

  /**
   * Suchwort löschen
   */

  onSearchClear() {
    this.searchKey = "";
  }

  /**
   * Beim Aufruf der nächsten Seite Daten parsen
   */

  handlePage() {
    this.fileService.parseDataIntoTable(this.data, this.dataTable, this.paginator);
  }

  /**
   * Download eines Dokuments
   * @param id gibt an welches Dokument gedownloaded werden soll
   */
  download(id: number): void {
    // Hole aus DokumentenID den Titel
    this.fileService.getDocumentTitle(id).subscribe(response => {
      const title = response.title;
      // Hole aus DokumentenID die Blob Datei
      this.fileService.getDocument(id).subscribe(BlobResponse => {
        // new Blob nötig, da Response nicht type definiert und nicht für Download ausreicht, zunächst als PDF
        // option { type: 'application/pdf'} möglich bei new Blob
        const blobFile: Blob = new Blob([BlobResponse]);

        // File im neuen Tab öffnen, jedoch Problem mit Route und Title
        // const downloadURL = window.URL.createObjectURL(blobFile);
        // window.open(downloadURL);

        // FileSaver sorgt dafür, dass blob/Datei gedownlaodet wird.
        fileSaver.saveAs(blobFile, title);
      });

    });
  }


  // Button neues Dokument, Dialog mit Upload-File.Component gefüllt.
  createDokumentDialog() {
    const allTitles: string[] = [];
    var i = 0;
    if (this.data.length > 0) {
      while (i < this.data.length) {
        allTitles.push(this.data[i].title);
        i++;
      }
    };

    var count = 0;
    var foundValue = false;
    while(!foundValue && count < this.userDepartment.length) {
      foundValue = (this.userDepartment[count].value == this.categoryFormControl.value);
      count++;
    }
    if(foundValue) {
      count = count - 1;
    }

    const dialogRef = this.dialog.open(UploadFileComponent, {
      data: {
        titles: allTitles,
        category: this.userDepartment[count]
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.data = [];
      this.dataTable = [];
      this.getDocumentTable();
    });
  }


  // Edit Button, Dialog mit Edit-File.Component gefüllt
  editDokumentDialog(doc: DocumentTable) {
    const allTitles: string[] = [];
    var i = 0;
    var sameTitle = false;
    if (this.data.length > 0) {
      while (i < this.data.length) {
        sameTitle = (doc.title === this.data[i].title);
        if (!sameTitle) {
          allTitles.push(this.data[i].title);
        }
        i++;
      }
    }
    const dialogRef = this.dialog.open(EditFileComponent, {
      data: {
        documentID: doc.documentID,
        title: doc.title,
        validity: doc.validity,
        creationDate: doc.creationDate,
        alterationDate: doc.alterationDate,
        parent: doc.parent,
        titles: allTitles
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.data = [];
      this.dataTable = [];
      this.getDocumentTable();

    });
  }

}

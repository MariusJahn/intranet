import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FilesystemComponent} from "../filesystem.component";
import {MessageToastrService} from "../../MessageService/message-toastr.service";
import {DocumentTable} from "../types/DocumentTable";
import {FileService} from "../file.service";
import {DocumentUpdate} from "../types/DocumentUpdate";



@Component({
  selector: 'app-edit-file',
  templateUrl: './edit-file.component.html',
  styleUrls: ['./edit-file.component.css']
})
export class EditFileComponent implements OnInit {

  public tooltipPosition = "above";

  constructor(
    public dialogRef: MatDialogRef<FilesystemComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
    public toastService: MessageToastrService,
    public fileService: FileService
  ) { }

  public parentOptions = this.data.titles; // Optionen für Vorgänger auswählen
  public filteredList = this.parentOptions.slice(); // Optionen, die angezeigt werden, wenn gesucht wird

  ngOnInit(): void {
  }

  /**
   * aufgerufen, wenn Form abgeschickt wird
   * Aktualisiert die Daten eines Dokuments und das Änderungsdatum
   * @param event
   */

  editDocument(event) {

    event.preventDefault();

    var docTable: DocumentTable = {
      documentID: this.data.documentID,
      title: this.data.title,
      validity: this.data.validity,
      creationDate: this.data.creationDate,
      alterationDate: this.data.alterationDate,
      parent: this.data.parent,
      category: this.data.category
    }

    var doc: DocumentUpdate = {
      documentID: docTable.documentID,
      validity: this.fileService.parseValidityBack(docTable.validity),
      parent: docTable.parent,
    };

    if(docTable.parent !== '') {
      this.fileService.putValidityInvalid(doc).subscribe();
    }

    this.fileService.putDocument(doc).subscribe();
    this.toastService.showToastr('Dokument wurde bearbeitet.', 'Bearbeitung erfolgreich', 'success');
    window.location.reload();
  }

  /**
   * Warnung, dass der Bearbeitungsmodus ohne speichern verlassen wurde
   */

  leaveEditMode() {
    this.toastService.showToastr('Alle Änderungen wurden verworfen.', 'Bearbeitung abgebrochen', 'warning');
  }

  /**
   * löscht den Parent des Dokuments in data
   */

  deleteParent() {
    this.data.parent = '';
  }

}

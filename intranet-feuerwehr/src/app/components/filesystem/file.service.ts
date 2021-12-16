import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Document} from "./types/Document";
import {MatPaginator} from "@angular/material/paginator";
import {DocumentTable} from "./types/DocumentTable";
import {environment} from "../../../environments/environment";
import {DocumentUpdate} from "./types/DocumentUpdate";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {
  }

  /**
   * Service fragt per Http Get nach Dokument an, erwartet Blob
   * @param id des Dokuments
   */
  getDocument(id: number): Observable<Blob> {
    return this.http.get(environment.apiRoute + `/filesystem/getDocument/${id}`, {responseType: 'blob'});
  }

  /**
   * Service fragt per Http Get nach DokumentTitelan
   * @param id des Dokuments
   */
  getDocumentTitle(id: number): Observable<any> {
    return this.http.get(environment.apiRoute + `/filesystem/getDocumentTitle/${id}`);
  }


  /**
   * Füllt das Array, das in der Tabelle angezeigt werden soll mit Daten aus dem Datenbankarray
   * füllt nur soweit man sehen kann
   * @param docArray Datenbankarray
   * @param tableDocArray Tabellenarray
   */
  parseDataIntoTable(docArray: Document[], tableDocArray: DocumentTable[], paginator: MatPaginator) {
    // do: testen mit mehr als 10 Elementen
    // Berechnung: von paginator.page * index bis paginator page * index + index

    // Begründung:
    // wenn der paginator bei seite 1 ist ist der Index 0 und 0 * irgendwas ist 0
    // wenn der paginator bei seite x ist dann ist der Index x-1 und Seite * Anzahl Objekte Pro Seite = maximale Anzahl der sichtbaren Objekte

    let start = paginator.pageIndex * paginator.pageSize;
    let end = start + paginator.pageSize;


    // wenn darzustellendes Array leer ist, Backend Array aber Elementen enthält gibt es etwas zu parsen, egal wie groß end ist
    // es ist weniger in Table Array als angezeigt werden kann und es ist noch etwas in Backend Array vorhanden, was noch nicht drin ist


    if ((tableDocArray.length == 0 && docArray.length > 0) || (tableDocArray.length < end - 1 && docArray.length > tableDocArray.length)) {

      // parsen von 0 (start) bis 9 (end -1) oder bis docArray endet

      if (tableDocArray.length < end - 1 && docArray.length > tableDocArray.length) {

        // parsen von tableDocArray.length bis end oder bis docArray endet
        start = tableDocArray.length;
      }

      while (start < docArray.length && start < end) {
        let tempTableDoc = this.parseToTableDoc(docArray[start]);


        tableDocArray.push(tempTableDoc);
        start++;
      }
    } else {
      // Table Array ist leer & Backend Array ist leer
      // Table Array enthält so viele Elemente, wie gesehen werden können oder mehr
      // nicht parsen
      // do: nach erfolgreichem Testen kann der Else-Zweig gelöscht werden

    }
  }

  /**
   * Parst das Dokument aus dem Backend in ein Dokument, das in der Tabelle angezeigt werden kann
   * @param backDoc Dokument aus dem Backend
   */

  parseToTableDoc(backDoc: Document): DocumentTable {
    var parentTable: string;
    switch(backDoc.parent) {
      case null|| undefined || '':
        parentTable = '';
        break;
      default:

        parentTable = backDoc.parent;
        break;
    }


    let tempTableDoc: DocumentTable = {
      documentID: backDoc.documentID,
      title: backDoc.title,
      validity: this.parseValidityTable(backDoc),
      creationDate: this.parseDate(backDoc.creationDate),
      alterationDate: this.parseDate(backDoc.alterationDate),
      parent: parentTable,
      category: backDoc.category

      // Vorgänger parsen nötig?
    };
    return tempTableDoc;
  }

  /**
   * parst die Gültigkeit aus der Datenbank(0/1) in eine anzeigbare Gültigkeit für die Tabelle
   * @param doc enthält Gültigkeit aus der Datenbank
   */

  parseValidityTable(doc: Document): string {
    if (doc.validity == 0) {
      return 'ungültig';
    } else if (doc.validity == 1) {
      return 'gültig';
    } else {
      // Exception werfen
      return 'undefiniert';
    }
  }

  /**
   * Parst Gültigkeit aus Tabelle in Gültigkeit für das Array mit den Dokumenten aus der Datenbank (0,1)
   * @param validity
   */

  parseValidityBack(validity: string): number {
    if (validity == 'ungültig') {
      return 0;
    } else if (validity == 'gültig') {
      return 1;
    } else {
      // DO: Exception werfen
      throw new Error('Dokument ist weder gültig noch ungültig. Gültigkeit ist: ' + validity);
    }
  }

  /**
   * zeigt das Datum in der HTML-Datei als LocaleString an
   * @param date
   */

  inLocalString(date: Date): String {
    return date.toLocaleString('de-DE');
  }

  /**
   * parst Daten als Date-Objekt
   * @param dateString
   */

  parseDate(dateString: Date): String {
    let date = new Date(dateString);
    let result = this.inLocalString(date);
    return result;
  }


  /**
   * speichert Gültigkeit, Vorgänger und das neue Änderungsdatum
   * @param type = category
   * @param doc
   */
  putDocument(doc: DocumentUpdate): Observable<DocumentUpdate> {
    return this.http.put<DocumentUpdate>(environment.apiRoute + "/filesystem/update", doc);
  }

  /**
   * holt alle Dokumente einer bestimmten Kategorie
   * @param type
   */

  getDocuments(type: String): Observable<Document[]> {
    if (type == 'all') {
      return this.http.get<Document[]>(environment.apiRoute + "/filesystem/all");
    } else if (type == 'da') {
      return this.http.get<Document[]>(environment.apiRoute + "/filesystem/da");
    } else if (type == 'db') {
      return this.http.get<Document[]>(environment.apiRoute + "/filesystem/db");
    } else if (type == '1') {
      return this.http.get<Document[]>(environment.apiRoute + "/filesystem/abt1");
    } else if (type == '2') {
      return this.http.get<Document[]>(environment.apiRoute + "/filesystem/abt2");
    } else if (type == '3') {
      return this.http.get<Document[]>(environment.apiRoute + "/filesystem/abt3");
    } else if (type == '4') {
      return this.http.get<Document[]>(environment.apiRoute + "/filesystem/abt4");
    } else if (type == '5') {
      return this.http.get<Document[]>(environment.apiRoute + "/filesystem/abt5");
    } else if (type == '6') {
      return this.http.get<Document[]>(environment.apiRoute + "/filesystem/abt6");
    } else if (type == '7') {
      return this.http.get<Document[]>(environment.apiRoute + "/filesystem/abt7");
    } else return
  }

  putValidityInvalid(doc: DocumentUpdate): Observable<any> {
    return this.http.put<DocumentUpdate>(environment.apiRoute + "/filesystem/updateValidity", doc);
  }




}

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Quicklink} from './quicklink';
import {Observable} from 'rxjs';
import {environment} from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})

// Service-Klasse für Quicklinks, die Weiterleitung ans Backend regelt
export class QuicklinksService {

  constructor(private http: HttpClient) { }

  // Liste der Links aus Datenbank geholt
  getQuicklink(): Observable<Quicklink[]> {
    return this.http.get<Quicklink[]>(environment.apiRoute + '/quicklinks/link');
  }

  // hinzuzufügender Link an Backend weitergeleitet
  addQuicklink(quicklink: Quicklink): Observable<any> {
    return this.http.post<Quicklink>(environment.apiRoute + '/quicklinks/addEntry', quicklink)
  }

  // zu löschender Link an Backend weitergeleitet
  deleteEntry(quicklink: Quicklink): Observable<Quicklink> {
    const url = environment.apiRoute + `/quicklinks/deleteEntry/${quicklink.quicklinkID}`;
    return this.http.delete<Quicklink>(url);
  }

}

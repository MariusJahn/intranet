import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Rights} from './rights';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {RolesAndRights} from "../roles/interfaces/roles-and-rights";

@Injectable({
  providedIn: 'root'
})
export class RightsService {

  constructor(private http: HttpClient) { }

  // Liste der Rechte aus Datenbank geholt
  getRights(): Observable<Rights[]> {
    return this.http.get<Rights[]>(environment.apiRoute + '/rights/recht');
  }

  getRightsFromRole(roleID: string): Observable<RolesAndRights[]> {
    return this.http.get<RolesAndRights[]>(environment.apiRoute + `/rights/getRightFromRole/${roleID}`);
  }

  getRightFromRightID(rightID: string): Observable<Rights> {
    return this.http.get<Rights>(environment.apiRoute + `/rights/rightByID/${rightID}`);
  }

}

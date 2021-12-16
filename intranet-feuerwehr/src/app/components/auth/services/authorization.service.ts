import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {SelectDepartment} from "../../filesystem/types/SelectDepartment";
import {UsernameResponse} from "../interfaces/UsernameResponse";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private http: HttpClient) { }

  /**
   * Fragt im Backend aus auth-token(übermittelt in http request durch Interceptor), ob User bestimmtes Recht besitzt: Parameter wichtig, welches Recht abgefragt wird.
   * @param rightID ID aus Db, welches Recht geprüft werden soll. z.b Quicklinksrechte -> 9
   * Aufruf MUSS mit gültigem Right ID erfolgen!
   * @param allowPermission bestimmt ob read,write oder execute im Recht erfüllt sein muss
   * Aufruf MUSS mit allowRead, allowWrite oder allowExecute als Parameter!
   */
   hasUserPermission(rightID: number, allowPermission: string): Observable<boolean>{
    return this.http.post<boolean>(environment.apiRoute + '/auth/hasUserPermission', {"rightID": rightID, "allowPermission": allowPermission});
  }

  getDepartmentsFromJWT(): Observable<any> {
    return this.http.get<any>(environment.apiRoute + '/auth/getDepartments');
  }


}

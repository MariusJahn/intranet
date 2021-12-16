import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, retry, tap} from 'rxjs/operators';
import {UserLogin} from '../shared/user';
import {LoginResponse} from './loginResponse';
import {TokenStorageService} from "../auth/services/token-storage.service";
import {environment} from "../../../environments/environment";
import * as bcrypt from 'bcryptjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  bIsAuthenticated: boolean;

  constructor(private http: HttpClient) { }

  configUrl = 'assets/config.json';

  /**
   * Der User bekommt einen Token
   * @param username (User)
   */

  getTokenForUser(username: string): Observable<LoginResponse> {
    // Seperat Body belegen, da nur String im Request
    return this.http.post<LoginResponse>(environment.apiRoute + '/login/token', {usernameReq: username});
  }

  /**
   * Prüfen, ob der Benutzer exisitert.
   * Wenn ja Passwort-Hash ausgeben, um auf Gleichheit zu prüfen
   * @param username (User)
   */

  getHashFromUsername(username: string): Observable<any> {
    // Seperat Body belegen, da nur String im Request
    return this.http.post<any>(environment.apiRoute + '/login',{usernameReq: username});
  }
}

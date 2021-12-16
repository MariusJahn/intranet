import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UsernameResponse} from "../interfaces/UsernameResponse";
import {UserIdResponse} from "../interfaces/UserIdResponse";
import {environment} from "../../../../environments/environment";
import { User } from '../../user/interfaces/User';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  // Methode wird von CanActivate aufgerufen, es wird überprüft im BackEnd ob authorization: "" in Header Request gültig ist,
  // Token automatisch im Header  durch Interceptor
  isAuthenticated(): Observable<boolean>  {
    return this.http.get<boolean>(environment.apiRoute + '/auth');
  }

  // Methode gibt aus JWT Token den username, die im JWT gespeichert ist.
  getUsername(): Observable<UsernameResponse> {
    return this.http.get<UsernameResponse>(environment.apiRoute + '/auth/getUsername');
  }
  // Methode gibt aus JWT Token an ob User admin ist oder nicht.
  isAdmin(): Observable<boolean> {
    return this.http.get<boolean>(environment.apiRoute + '/auth/isAdmin');
  }

  // Methode gibt aus JWT Token die userId, die im JWT gespeichert ist.
  getUserId(): Observable<UserIdResponse> {
    return this.http.get<UserIdResponse>(environment.apiRoute + '/auth/getUserId');
  }

  // Methode liefert User von ID
  getUserByJWT(): Observable<User> {
    return this.http.get<User>(environment.apiRoute + '/auth/getUser');
  }

  // TODO: AUSGELAGERT DURCH JWT INTERCEPTOR
  // // Hilfsmethode um Redundanzen zu vermeiden, erzeugt einen Header mit JWT
  // getJWTInHeader(): HttpHeaders{
  //
  //   const jwt = this.tokenStorageService.getToken();
  //
  //   const httpHeaders: HttpHeaders = new HttpHeaders({
  //     Authorization: 'Bearer ' + jwt
  //   });
  //   return httpHeaders;
  // }
}

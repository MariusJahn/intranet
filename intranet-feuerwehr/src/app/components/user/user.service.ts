import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { User } from "./interfaces/User";
import { catchError } from 'rxjs/operators';
import {environment} from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  /**
   * Service wird vom User Component aufgerufen und sendet erzeugten User ans Backend.
   * @param user
   */
  createUser(user: User): Observable<User> {
    return this.http.post<User>(environment.apiRoute + '/register', user);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(environment.apiRoute + "/users");
  }

  /**
   * Methode um Vor und Nachname eines Users zu bekommen anhand seiner ID
   * Typ any, da Response Vor und Nachname als Json object übergibt
   * @param mitarbeiterID des Users
   */
  getNameByID(mitarbeiterID: string): Observable<any> {
    return this.http.get<any>(environment.apiRoute + `/users/getNameByID/${mitarbeiterID}`);

  }

  deleteUser(user: User): Observable<User> {
    const url = environment.apiRoute + `/users/deleteUser/${user.MitarbeiterID}`;

    return this.http.delete<User>(url);
  }

  updateUser(user: User): Observable<User> {
    const url = environment.apiRoute + `/users/updateUser/${user.MitarbeiterID}`;

    return this.http.put<User>(url,user);
  }

  updateUserPassword(user: User): Observable<User> {
    const url = environment.apiRoute + `/users/updateUserPassword/${user.MitarbeiterID}`;

    return this.http.put<User>(url,user);
  }
}

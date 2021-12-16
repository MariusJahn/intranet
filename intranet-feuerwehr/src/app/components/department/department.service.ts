import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Department} from "./Department";
import {UserDepartment} from "./User-department";
import {Roles} from "../roles/interfaces/roles";
import {DepartmentToUsersComponent} from "./department-to-users/department-to-users.component";

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient) { }


  // Liste der Abteilungen aus Datenbank geholt
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(environment.apiRoute + '/department/departments');
  }

  // holt Abteilungen eines Mitarbeiters (aus id) ( aus Zwischentabelle )
  getDepartmentByUserID(mitarbeiterID: string): Observable<Department[]> {
    return this.http.get<Department[]>(environment.apiRoute + `/department/getDepartmentBy/${mitarbeiterID}`);
  }

  // Füllt EINE Zeile (Eine Abteilung zu Mitarbeiter).
  addDepartmentToUser(userDepartment: UserDepartment): Observable<UserDepartment> {
    return this.http.post<UserDepartment>(environment.apiRoute + '/department/departmentToUser', userDepartment);
  }

  // Updatet zwischentabelle mitarbeiter_abteilung
  updateDepartmentsFromUser(mitarbeiterID: string, actualDepartment) {
    const url = environment.apiRoute + `/department/updateDepartmentsFromUser/${mitarbeiterID}`;
    return this.http.put(url, actualDepartment);
  }
}

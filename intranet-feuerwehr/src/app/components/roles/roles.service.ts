 import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Roles} from './interfaces/roles';
import {Observable} from 'rxjs';
import {RolesAndRights} from './interfaces/roles-and-rights';
import {environment} from "../../../environments/environment";
 import {UserDepartment} from "../department/User-department";
 import {UserRole} from "../user/interfaces/UserRole";

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) { }

  // Liste der Rollen aus Datenbank geholt
  getRoles(): Observable<Roles[]> {
    return this.http.get<Roles[]>(environment.apiRoute + '/rollen/role');
  }

  // Holt die ID aus der Datenbank
  getRoleIDByName(name): Observable<any> {
    return this.http.get<any>(environment.apiRoute + `/rollen/RoleByName/${name}`);
  }

  // Holt die Rollen zu einer bestimmten MitarbeiterID aus der Datenbank
  getRolesById(mitarbeiterID): Observable<Roles[]> {
    return this.http.get<Roles[]>(environment.apiRoute + `/rollen/getRoles/${mitarbeiterID}`);
  }

  // Holt die Rolle zu der zugehörigen ID aus der Datenbank
  getRole(roleID): Observable<Roles> {
    return this.http.get<Roles>(environment.apiRoute + `/rollen/getRole/${roleID}`);
  }

  // Rollen- und zugehörige RechteIDs aus Datenbank geholt
  getIDs(): Observable<RolesAndRights[]> {
    return this.http.get<RolesAndRights[]>(environment.apiRoute + '/rollen_rechte/ID');
  }

  // neue Rolle in Datenbank eingefügt
  addRole(role: Roles): Observable<Roles> {
    return this.http.post<Roles>(environment.apiRoute + '/rollen/addEntry', role);
  }

  // RollenID mit zugehörigen RechteIDs in Datenbank eingefügt
  addRoleAndRight(roleRight: RolesAndRights): Observable<RolesAndRights> {
    return this.http.post<RolesAndRights>(environment.apiRoute + '/rollen_rechte/addEntry', roleRight);
  }

  // Rolle bzw. Werte aus Zwischentabelle gelöscht aus Datenbank gelöscht
  deleteEntry(toDelete: Roles): Observable<any> {
      const url = environment.apiRoute + `/rollen/deleteEntry/${toDelete.roleID}`;
      return this.http.delete<Roles>(url);
  }

  /**
   * aktualisiert die Rechte die zur einer Rolle gehören.
   * @param rights
   */
  updateRightsFromRole(rights: RolesAndRights): Observable<RolesAndRights> {
    const url = environment.apiRoute + `/rollen/updateRightsFromRole/${rights.roleID}`;
    return this.http.put<RolesAndRights>(url, rights);
  }

  /**
   * Aktualisiert die Rollen eines Users.
   * @param mitarbeiterID, aktueller User
   * @param actualRoles, die neu zugewiesenen Rollen
   */
  updateRolesFromUser(mitarbeiterID: number, actualRoles: Roles[]) {

    const url = environment.apiRoute + `/rollen/updateRolesFromUser/${mitarbeiterID}`;
    return this.http.put(url, actualRoles);

  }


  // Füllt EINE Zeile in zwischentabelle (Eine Rolle zu Mitarbeiter).
  addRoleToUser(roleToUser: UserRole): Observable<UserRole> {
    return this.http.post<UserRole>(environment.apiRoute + '/rolesAndUser/roleToUser', roleToUser);
  }
}

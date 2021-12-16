import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {RolesAndRights} from "../interfaces/roles-and-rights";
import {Roles} from "../interfaces/roles";
import {RolesService} from "../roles.service";
import {MessageToastrService} from "../../MessageService/message-toastr.service";
import {UserService} from "../../user/user.service";

@Component({
  selector: 'app-roles-to-users',
  templateUrl: './roles-to-users.component.html',
  styleUrls: ['./roles-to-users.component.css']
})
export class RolesToUsersComponent implements OnInit {

  displayedColumns: string[] = ['checked', 'name', 'description'];

  dataSource;

  public mitarbeiterID;

  public name: string;
  public lastname: string;

  public rollen: Roles[];

  public rolesById: Roles[];

  public actualRoles: Map<number, boolean>;

  constructor(private route: ActivatedRoute,
              private rolesService: RolesService,
              private userService: UserService,
              private toastService: MessageToastrService,
              private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.mitarbeiterID = params.get('mitarbeiterID');

      this.userService.getNameByID(this.mitarbeiterID).subscribe((nameResponse) => {
        this.name = nameResponse.name;
        this.lastname = nameResponse.lastname;
      });

      this.rolesService.getRoles().subscribe((roles: Roles[]) => {
        this.rollen = roles;

        this.dataSource = new MatTableDataSource<Roles>(this.rollen);

        this.rolesService.getRolesById(this.mitarbeiterID).subscribe((rolesById: Roles[]) => {
          this.rolesById = rolesById;

          this.actualRoles = this.getActualRoles(this.rollen,this.rolesById);
        })
      })
    })
  }

  /**
   * Fügt die belegten Rollen einer MAP hinzu um zu "checken",
   * welche Rolle zugewiesen ist, und welche nicht.
   *
   * TODO: Anderen Weg finden, Alles in einen Algo wäre besser
   *
   * @param roles
   * @param rolesByID
   */
  getActualRoles(roles, rolesByID): Map<number ,boolean> {

    var map = new Map();

    for(let i =0; i < roles.length ; i++) {

      let hasRole = false;
      map.set(roles[i].roleID, hasRole);

    }

    for(let i =0; i < rolesByID.length ; i++) {

      map.set(rolesByID[i].roleID, true);

    }

    return map;

  }

  /**
   * Ändert den aktuellen Check Wert.
   * Beispiel:
   * User 4 hat nun nicht mehr Rolle 78.
   *
   * @param roleID ist die Rolle die aktualisiert wird.
   */
  toggle(roleID: number) {
    let isChecked;

    isChecked = this.actualRoles.get(roleID);

    this.actualRoles.set(roleID,!isChecked);

    return !isChecked;

  }

  /**
   * Wandelt die Map zu einem Roles[] Feld um.
   * @param map
   */
  transformToArray(map: Map<number,boolean>): Roles[] {
    let entries = map.entries();
    var newRoles: Roles[] = [];

    for(let i=0;i<map.size;i++) {
      let entry = entries.next();

      if (entry.value[1] == true) {
        newRoles.push(
          {roleID: entry.value[0],
            name: "",
            description: ""}
        );
      }
    }

    return newRoles;
  }

  /**
   * Speichert das "Formular" bzw. die Tabelle neu ab.
   *
   * Aktualisiert also die Rollen des Users.
   */
  save() {
    let rolesArray = this.transformToArray(this.actualRoles);
    this.rolesService.updateRolesFromUser(this.mitarbeiterID, rolesArray).subscribe(() => {
      this.toastService.showToastr("Alle Rollen wurden Erfolgreich aktualisiert", "Erfolgreich Aktualisiert", "success");
      this.router.navigate(["/user/user-table"]);
    });

  }

}

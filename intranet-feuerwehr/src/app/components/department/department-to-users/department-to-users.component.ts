import { Component, OnInit } from '@angular/core';
import {Roles} from "../../roles/interfaces/roles";
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute, Router} from "@angular/router";
import {RolesService} from "../../roles/roles.service";
import {Department} from "../Department";
import {DepartmentService} from "../department.service";
import {MessageToastrService} from "../../MessageService/message-toastr.service";
import {UserService} from "../../user/user.service";

@Component({
  selector: 'app-department-to-users',
  templateUrl: './department-to-users.component.html',
  styleUrls: ['./department-to-users.component.css']
})
export class DepartmentToUsersComponent implements OnInit {

  displayedColumns: string[] = ['checked', 'departmentName'];

  dataSource;

  public mitarbeiterID: string;

  public name: string;
  public lastname: string;

  public departments: Department[];

  public departmentByUser: Department[];

  // Schlüssel: Number = Department ID, Wert: Boolean = true oder false wenn User in Abteilung drin ist
  public actualDepartments: Map<number, boolean>;

  constructor(private route: ActivatedRoute,
              private departmentService: DepartmentService,
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

      this.departmentService.getDepartments().subscribe((departments) => {
        this.departments = departments;

        this.dataSource = new MatTableDataSource<Department>(this.departments);

        this.departmentService.getDepartmentByUserID(this.mitarbeiterID).subscribe((departmentByUser) => {
          this.departmentByUser = departmentByUser;

          this.actualDepartments = this.getActualDepartments(this.departments, this.departmentByUser);

        });
      });
    });
  }

  /**
   * Fügt der Map, alle Abteilungen hinzu und setzt die Werte true, wenn User in der Abteilung (SchlüsselID) drin ist
   * @param allDepartments
   * @param departmentByUser
   */
  getActualDepartments(allDepartments: Department[], departmentByUser: Department[]) {

    const map = new Map();

    for (let i = 0; i < this.departments.length ; i++) {
      map.set(this.departments[i].abteilungID, false);
    }

    for (let i = 0; i < this.departmentByUser.length ; i++) {
      map.set(this.departmentByUser[i].abteilungID, true);
    }
    return map;
  }

  /**
   * Ändert aktuellen Check-Wert in Reihe
   * @param departmentID ist die ID der Abteilung die geändert wurde per Ceckbox
   */
  toggle(departmentID: number) {
    let isChecked;

    isChecked = this.actualDepartments.get(departmentID);

    this.actualDepartments.set(departmentID, !isChecked);
    return !isChecked;

  }

  /**
   * Wandelt die Map (Neues Array nach speichern) zu einem Department[] Feld um.
   * @param map
   */
  transformMapToArray(map: Map<number, boolean>): Department[] {
    let entries = map.entries();
    var newDepartments: Department[] = [];

    for(let i=0;i<map.size;i++) {
      let entry = entries.next();

      if (entry.value[1] === true) {
        newDepartments.push(
          { abteilungID: entry.value[0],
            name: "",
            }
        );
      }
    }
    return newDepartments;
  }

  /**
   * Speichert das "Formular" bzw. die Tabelle neu ab.
   *
   * Aktualisiert also die Abteilungen des ausgewählten Users.
   */
  save() {
    const newDepartmentArray = this.transformMapToArray(this.actualDepartments);
    this.departmentService.updateDepartmentsFromUser(this.mitarbeiterID, newDepartmentArray).subscribe(() => {
      this.toastService.showToastr("Alle Abteilungen wurden Erfolgreich aktualisiert", "Erfolgreich Aktualisiert", "success");
      this.router.navigate(["/user/user-table"]);
    });

  }

}

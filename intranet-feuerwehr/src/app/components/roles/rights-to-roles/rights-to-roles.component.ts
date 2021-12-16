import { Component, OnInit } from '@angular/core';
import {Rights} from "../../rights/rights";
import {RightsService} from "../../rights/rights.service";
import {ActivatedRoute, Router} from "@angular/router";
import {News} from "../../newsfeed/types/News";
import {RolesAndRights} from "../interfaces/roles-and-rights";
import {MatTableDataSource} from "@angular/material/table";
import {RolesService} from "../roles.service";
import {iterator} from "rxjs/internal-compatibility";
import {Roles} from "../interfaces/roles";
import {MessageToastrService} from "../../MessageService/message-toastr.service";


@Component({
  selector: 'app-rights-to-roles',
  templateUrl: './rights-to-roles.component.html',
  styleUrls: ['./rights-to-roles.component.css']
})
export class RightsToRolesComponent implements OnInit {

  public tooltipPosition = "above";

  displayedColumns: string[] = ['right', 'read', 'write', 'execute'];

  dataSource;

  // Array rollen_rechte für dazugehörige RoleID
  public rolesAndRights: Array<RolesAndRights>;

  // Array rechte für dazugehörige rightIDs zur Rolle
  public rights: Array<Rights> = [];

  public actualRole: Roles;

  constructor(private route: ActivatedRoute,
              private rightsService: RightsService,
              private rolesService: RolesService,
              private toastService: MessageToastrService,
              private router: Router) { }

  ngOnInit(): void {
    // Ziehe Role ID aus URL
    this.route.paramMap.subscribe(params => {
      const roleID = params.get('roleID');

      // Rollen Object (Rolle aus DB) aus ID speichern
      this.rolesService.getRole(roleID).subscribe((resultRole) => {
        this.actualRole = resultRole;

        // Ziehe rollen_rechte aus DB
        this.rightsService.getRightsFromRole(roleID).subscribe((rights) => {
          this.rolesAndRights = rights;
          this.dataSource = new MatTableDataSource<RolesAndRights>(this.rolesAndRights);

          // Ziehe alle rechte aus rolle und füge sie Rechte Array hinzu
          for (const right of this.rolesAndRights) {
            const rightID = right.rightID.toString()
            this.rightsService.getRightFromRightID(rightID).subscribe((right) => {
              this.rights.push(right);
            });
          }
        });
      });
    });
  }

  /**
   * Speichert die Rechte (Checkboxen (Toggle) siehe html) der ausgewählten Rolle VIA Two-Way-Binding
   *
   */
  save() {
    // Jedes Recht aus Rolle neu updaten in Zwischentabelle (put)
    for (const roleRight of this.rolesAndRights) {
      this.rolesService.updateRightsFromRole(roleRight).subscribe(() => {
        this.toastService.showToastr("Alle Rechte wurden Erfolgreich aktualisiert", "Erfolgreich Aktualisiert", "success");
        this.router.navigate(["/user/rollenverwaltung"])
      });
    }
  }

  leaveEditMode() {
    this.toastService.showToastr('Alle Änderungen wurden verworfen.', 'Bearbeitung abgebrochen', 'warning');
  }
}

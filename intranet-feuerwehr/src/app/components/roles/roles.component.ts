import { Component, OnInit } from '@angular/core';
import {Roles} from './interfaces/roles';
import {RolesService} from './roles.service';
import {Rights} from '../rights/rights';
import {RightsService} from '../rights/rights.service';
import {UserService} from '../user/user.service';
import {MatDialog} from '@angular/material/dialog';
import {RolesAndRights} from './interfaces/roles-and-rights';
import {CreateRoleComponent} from "./create-role/create-role.component";
import {MessageToastrService} from "../MessageService/message-toastr.service";

@Component({
  selector: 'app-rollen',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  // Array für Rollen in Datenbank
  public roles: Array<Roles>;

  // Array für Rechte in Datenbank
  public rights: Array<Rights>;

  public displayedColumns = ['name', 'description', 'action'];

  public tooltipPosition = "above";

  constructor(private rolesService: RolesService,
              private rightsService: RightsService,
              private userService: UserService,
              private toastService: MessageToastrService,
              private dialog: MatDialog) { }

  // Array von Rollen und Rechten aus Datenbank geholt
  ngOnInit(): void {
    this.rolesService.getRoles().subscribe((roles: Roles[]) => {
      this.roles = roles;
    });
    this.rightsService.getRights().subscribe((rights: Rights[]) => {
      this.rights = rights;
    });
  }

  // Methode zum Löschen einer Rolle
  public deleteRole(role: Roles): void {
    if(confirm('Möchten Sie diese Rolle wirklich löschen?')) {
      // Rolle löschen, zwischentabelle werte werden durch Cascade gelöscht
      this.rolesService.deleteEntry(role).subscribe((deletedRole: Roles) => {
        this.rolesService.getRoles().subscribe((roles: Array<Roles>) => {
          this.roles = roles;
          this.toastService.showToastr("Rolle wurde erfolgreich gelöscht.", "Erfolgreich gelöscht", "success");
        });
      });
    }

  }
  // Prüfung, ob Rolle Adminstrator ist -> momentan genutzt, damit Admin-Rolle nicht geändert/gelöscht werden kann
  public noAdmin(name: string): boolean {
    return (name !== 'Admin');
  }
  /**
   * Öffnet ein Dialogfenster für die Bearbeitung einer neuen Rolle die angelegt werden soll.
   */
  createRoleDialog() {
    const dialogRef = this.dialog.open(CreateRoleComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.rolesService.getRoles().subscribe((roles: Array<Roles>) => {
        this.roles = roles;
      });
    });
  }

}

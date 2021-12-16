import {Component, Inject, OnInit} from '@angular/core';
import {RolesAndRights} from "../interfaces/roles-and-rights";
import {Roles} from "../interfaces/roles";
import {Rights} from "../../rights/rights";
import {RolesService} from "../roles.service";
import {RightsService} from "../../rights/rights.service";
import {FormControl} from "@angular/forms";
import {MessageToastrService} from "../../MessageService/message-toastr.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.css']
})
export class CreateRoleComponent implements OnInit {


  // Array für Rollen in Datenbank
  public roles: Array<Roles>;

  // Array für Rechte in Datenbank
  public rights: Array<Rights>;

  // Variable für neuen Namen, falls neue Rolle hinzugefügt wird
  public newRoleName = '';

  // Variable für neue Beschreibung, falls neue Rolle hinzugefügt wird
  public newRoleDesciption = '';

  public createdRole: Roles;


  constructor(private rolesService: RolesService,
              private rightsService: RightsService,
              private toastService: MessageToastrService,
              private router: Router) { }

  ngOnInit(): void {

    // Nötig um Name zu prüfen
    this.rolesService.getRoles().subscribe((roles: Roles[]) => {
      this.roles = roles;
    });

  }

  public addRole(event): void {
    event.preventDefault();
    // Prüfung, ob Name bereits für andere Rolle vergeben
    let hasSameName = true;
    let i = 0;
    while (hasSameName && i < this.roles.length ) {
      if (this.newRoleName === this.roles[i].name) {
        hasSameName = false;
      }
      i++;
    }

    // falls Name noch nicht vergeben ist, wird die Rolle hinzugefügt, ansonsten erfolgt eine Warnung und die Rolle wird
    // nicht hinzugefügt

    if (!hasSameName) {
      this.toastService.showToastr('Bitte einen anderen Namen wählen.', 'Name ist bereits vergeben', 'error');
    } else {
      // Rolle wird erstellt und hinzugefügt
      const newRole: Roles = {
        roleID: 0,
        name: this.newRoleName,
        description: this.newRoleDesciption
      };
      this.rolesService.addRole(newRole).subscribe(() => {
        this.rolesService.getRoles().subscribe((roles: Array<Roles>) => {
          this.roles = roles;
        });
        this.toastService.showToastr("Rolle erfolgreich erstellt", "Erfolgreich erstellt", "success");
        this.rolesService.getRoleIDByName(newRole.name).subscribe( (response) => {

          let id = response.roleID;

          this.router.navigate(['/user/rechtezurollen', id]);
        })
      }, error => {
        this.toastService.showToastr('Rolle konnte nicht hinzugefügt werden (Rolle schon vorhanden).', 'Erstellen fehlgeschlagen', 'error');
      });
    }
  }

  /**
   * wenn das Erstellen abgebrochen wird, wird eine Fehlermeldung angezeigt
   */

  leaveCreateMode() {
    this.toastService.showToastr('Rolle wurde nicht angelegt.', 'Erstellen abgebrochen','warning');
  }
}

import { Component, OnInit } from '@angular/core';
import { UserService} from '../user.service';
import {User} from '../interfaces/User';
import {UserLogin} from '../../shared/user';
import {FormControl, Validators} from '@angular/forms';
import * as bcrypt from 'bcryptjs';
import {MessageToastrService} from '../../MessageService/message-toastr.service';
import {Roles} from "../../roles/interfaces/roles";
import {Department} from "../../department/Department";
import {RolesService} from "../../roles/roles.service";
import {DepartmentService} from "../../department/department.service";
import {RolesAndRights} from "../../roles/interfaces/roles-and-rights";
import {UserDepartment} from "../../department/User-department";
import {UserRole} from "../interfaces/UserRole";


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {


  public username = '';
  public password = '';
  public passwordControl = '';
  public vorname = '';
  public nachname = '';
  public email = '';
  public telefon = '';

  // Array mit alles Usern, nötig um mitarbeiterID in Zwischentabellen zu bestimmen
  users: User[];

  // Array für Abteilung aus Datenbank
  public departments: Array<Department>;

  // Array für Abteilung aus Datenbank
  public roles: Array<Roles>;

  // Besitzt AbteilungID(Value), der ausgewählten Abteilungen
  departmentFormControl: FormControl = new FormControl();

  // Besitzt RolesID(Value), der ausgewählten Rollen
  rolesFormControl: FormControl = new FormControl();



  constructor(private userService: UserService,
              private toastService: MessageToastrService,
              private roleService: RolesService,
              private departmentService: DepartmentService) { }

  ngOnInit(): void {

    // Service belegt roles array, alle Rollen aus DB
    this.roleService.getRoles().subscribe((roles: Roles[]) => {
      this.roles = roles;
    });

    // Service belegt department array, alle Abteilungen aus DB
    this.departmentService.getDepartments().subscribe((departments: Department[]) => {
      this.departments = departments;
    });

    // Service belegt user array, alle User aus DB
    this.userService.getUsers().subscribe((user: User[]) => {
      this.users = user;
    });

  }


  encryptPassword(password: string): any {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    return hash;
  }

  /**
   * Wenn auf Submit geklickt wird und Eingabe korrekt erfolgt, wird ein User erzeugt und an das Backend
   * weitergeleiter durch Service.
   * @param event
   */
  registerUser(event) {
    event.preventDefault();

    if (this.username === '') {
      this.toastService.showToastr('Es wurde kein Benutzername eingegeben.', 'Benutzername fehlt', 'error');
    }
    else if(this.email === '') {
      this.toastService.showToastr('Es wurde keine E-Mail Adresse eingegeben.', 'E-Mail Adresse fehlt', 'error');
    }
    else if(this.password === '') {
      this.toastService.showToastr('Es wurde kein Passwort eingegeben.', 'Passwort fehlt', 'error');
    }
    else if(this.passwordControl === '') {
      this.toastService.showToastr('Das Passwort wurde nicht wiederholt.', 'Wiederholtes Passwort fehlt', 'error');
    }
    else if(this.password !== this.passwordControl) {
      this.toastService.showToastr('Es wurden zwei verschiedene Passwörter eingegeben.', 'Passwörter stimmen nicht überein', 'error');
    }

    // prüft ob beide Passwörter identisch sind und keine Leereingabe weitergeleitet wird.
    else if(this.password === this.passwordControl && !(this.username === '') && !(this.email === '') && !(this.password === '')) {
      // RegEx ob Passwort sicher ist.
      const regexPasswordCheck = new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$');
      // (?=.*\d) mindestens eine Ziffer
      // (?=.*[a-z]) mindestens ein Kleinbuchstabe
      // (?=.*[A-Z]) mindestens ein Großbuchstabe
      // [0-9a-zA-Z]{8,} muss mindestens 8 Buchstaben und Ziffern enthalten
      if (regexPasswordCheck.test(this.password)) {
        // erzeugt aus gültige Eingabe einen User.
        const newUser: User = {
          MitarbeiterID: 0, // Wird in Sql Datenbank auto incrementet
          Benutzername: this.username,
          Passwort: this.encryptPassword(this.password),
          Email: this.email,
          Vorname: this.vorname,
          Nachname: this.nachname,
          Telefon: this.telefon,
        };
        this.userService.createUser(newUser).subscribe(() => {
          this.userService.getUsers().subscribe((user: User[]) => {
            this.users = user;
            // Gewählte Abteilungen in Zwischentabelle mitarbeiter_abteilung befüllen.
            let i = 0;
            while (i < this.departmentFormControl.value.length){
              const departmentToUserReference: UserDepartment = {
                mitarbeiterID: this.users[0].MitarbeiterID, // immer MitarbeiterID des neu hinzugefügten Users, 0 da per DESC Sortiert wird getUsers in DB, neuste rolle am Anfang
                abteilungID: this.departmentFormControl.value[i] // Enthält ausgewählte AbteilungsID
              };
              i++;
              // Belege zur Rolle eine Recht ( RightID), im While drin daher werden mehrere Rechte zur Rolle hinzugefügt, je nach Auswahl.
              this.departmentService.addDepartmentToUser(departmentToUserReference).subscribe(() => {
              });
            }
            // Gewählte Rollen in Zwischentabelle mitarbeiter_rollen befüllen
            let j = 0;
            while (j < this.rolesFormControl.value.length){
              const roleToUserReference: UserRole = {
                MitarbeiterID: this.users[0].MitarbeiterID, // immer MitarbeiterID des neu hinzugefügten Users
                roleID: this.rolesFormControl.value[j] // Enthält ausgewählte roleID
              };
              j++;
              // Belege zur Rolle eine Recht ( RightID), im While drin daher werden mehrere Rechte zur Rolle hinzugefügt, je nach Auswahl.
              this.roleService.addRoleToUser(roleToUserReference).subscribe(() => {
              });
            }
          });
          this.toastService.showToastr('Ein neuer Nutzer wurde registriert.', 'Nutzer erfolgreich registriert', 'success');
        }, error => {
          this.toastService.showToastr('Nutzer konnte nicht registriert werden (Username belegt)', 'Nutzer registrieren fehlgeschlagen', 'error');
        });

      } else {
        this.toastService.showToastr('Die Passwortkriterien sind nicht erfüllt.', 'Ungültiges Passwort', 'error');
      }
    }
  }

  leaveCreateMode() {
    this.toastService.showToastr('Der Benutzer wurde nicht erstellt.', 'Erstellung abgebrochen', 'warning');
  }
}

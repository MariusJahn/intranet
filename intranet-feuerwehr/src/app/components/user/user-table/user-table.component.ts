import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { HttpClient } from "@angular/common/http";
import{ UserService} from "../user.service";
import { MatTableDataSource} from "@angular/material/table";
import {User} from "../interfaces/User";
import { Observable, of as observableOf, merge } from 'rxjs';
import { MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { UserComponent} from "../createUser/user.component";
import { UserDetailsComponent} from "../user-edit/user-details.component";
import { MessageToastrService } from "../../MessageService/message-toastr.service";
import {CreateRoleComponent} from "../../roles/create-role/create-role.component";
import {Roles} from "../../roles/interfaces/roles";

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<User>;

  public tooltipPosition = "above";

  searchKey: string;
  users: Array<User>;
  userDataSource;
  displayedColumns = ['MitarbeiterID', 'Vorname','Nachname','Benutzername','Email', 'Telefon','actions'];

  constructor(private userService: UserService,
              private dialog: MatDialog,
              private toastService: MessageToastrService) { }


  ngOnInit(): void {
    this.getUsersTable();
  }

  /**
   * Schnittstelle zum Backend
   * Lädt die Mitarbeiter-Daten aus der DB und stellt Funktionen zur Verfügung
   * wie Seitenwechsel(Paginator) und Sortieren der Liste
   */
  getUsersTable() {
    this.userService.getUsers().subscribe((user: User[]) => {
      this.users = user;
      this.userDataSource = new MatTableDataSource(this.users);
      this.userDataSource.paginator = this.paginator;
      this.userDataSource.sort = this.sort;
      });
  }
  /**
   * Filtert die Benutzertabelle entsprechend der Eingabe in der Suchleiste
   * @param event
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userDataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Eingabe in der Suchleiste verschwindet
   * wenn man aufs x klickt
   */
  onSearchClear() {
    this.searchKey= "";
  }

  /**
   * Löscht einen Benutzereintrag
   * @param user
   */
  deleteUser(user: User): void {
    if (confirm('Möchten Sie diesen Benutzer wirklich löschen?')) {
      this.userService.deleteUser(user).subscribe((deletedUser: User) => {
        this.getUsersTable();

      });
      this.toastService.showToastr('Der Benutzer wurde gelöscht.', 'Erfolgreich gelöscht', 'success');
    }
  }

  /**
   * Öffnet ein DialogFenster für die Benutzererstellung
   */
  openUserDialog() {

    const dialogRef = this.dialog.open(UserComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.getUsersTable();
    });
  }

  /**
   * Öffnet ein Dialogfenster für die Bearbeitung eines Benutzers
   */
  openUserDetailsDialog(user: User) {
    const dialogRef = this.dialog.open(UserDetailsComponent, {
      data:  {
        MitarbeiterID: user.MitarbeiterID,
        Benutzername: user.Benutzername,
        Passwort: user.Passwort,
        Email: user.Email,
        Vorname: user.Vorname,
        Nachname: user.Nachname,
        Telefon: user.Telefon,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getUsersTable();
    });
  }
}

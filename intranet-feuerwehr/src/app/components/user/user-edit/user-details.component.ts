import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {UserComponent} from '../createUser/user.component';
import { UserService } from '../user.service';
import { User } from '../interfaces/User';
import { UserLogin } from '../../shared/user';
import { MessageToastrService } from "../../MessageService/message-toastr.service";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  // Kommt nicht vom übergebenen data
  public newPassword = '';
  public newPasswordControl = '';


  constructor(
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastService: MessageToastrService) {  }

  ngOnInit(): void {
  }


  editUser(event): void {
    event.preventDefault();

    /**
     * Aktualisiert einen Benutzer nur, wenn Benutzername und Email eingetragen sind
     */
    if (!(this.data.Benutzername === '') && !(this.data.Email === '')) {
      const user: User = {
        MitarbeiterID: this.data.MitarbeiterID,
        Benutzername: this.data.Benutzername,
        Passwort: this.data.Passwort,
        Vorname: this.data.Vorname,
        Nachname: this.data.Nachname,
        Email: this.data.Email,
        Telefon: this.data.Telefon,
      };

      // prüfen, ob password neu gesetzt
      if((this.newPassword !== '') && (this.newPassword === this.newPasswordControl)) {

        const regexPasswordCheck = new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$');

        // prüfen, ob Passwort Kriterien erfüllt sind
        if (regexPasswordCheck.test(this.newPassword)) {
          // wenn ja, dann Passwort aktualisieren
          user.Passwort = this.newPassword;
          this.userService.updateUserPassword(user).subscribe();
          this.toastService.showToastr('Die Benutzerdaten wurden aktualisiert.', 'Erfolgreich aktualisiert', 'success');

        } else {

          this.toastService.showToastr('Die Passwortkriterien wurden nicht erfüllt.', 'Ungültiges Passwort', 'error');
        }

      } else if ((this.newPassword !== '') && this.newPasswordControl === '') {

        this.toastService.showToastr('Das Passwort wurde nicht zwei Mal eingegeben.', 'Passwort ändern fehlgeschlagen', 'error');

      } else if(!(this.newPassword === '') && this.newPassword !== this.newPasswordControl) {

        this.toastService.showToastr('Die Passwörter stimmen nicht überein.', 'Passwort ändern fehlgeschlagen', 'error');

      } else if(this.newPasswordControl !== '') {

        this.toastService.showToastr('Das Passwort wurde nicht zwei Mal eingegeben.', 'Passwort ändern fehlgeschlagen', 'error');
      }

      else {

        this.userService.updateUser(user).subscribe();
        this.toastService.showToastr('Die Benutzerdaten wurden aktualisiert.', 'Erfolgreich aktualisiert', 'success');
      }
    }
    else if(this.data.Benutzername === '') {
      this.toastService.showToastr('Es wurde kein Benutzername eingegeben.', 'Benutzername fehlt', 'error');
      return;
    }
    else if(this.data.Email === '') {
      this.toastService.showToastr('Es wurde keine E-Mail Adresse eingegeben.', ' E-Mail Adresse fehlt', 'error');
      return;
    }


  }

  /**
   * Edit Mode verlassen, Änderungen verwerfen
   */

  leaveEditMode() {
    this.toastService.showToastr('Alle Änderungen wurden verworfen.', 'Bearbeitung abgebrochen', 'warning');
  }



}

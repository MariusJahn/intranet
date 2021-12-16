import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router} from "@angular/router";
import { LoginService} from "./login.service";
import {UserLogin} from '../shared/user';
import {LoginResponse} from "./loginResponse";
import {TokenStorageService} from "../auth/services/token-storage.service";
import {AuthService} from "../auth/services/auth.service";
import {Observable} from "rxjs";
import {MessageToastrService} from "../MessageService/message-toastr.service";
import {Message} from "../shared/message";
import {HeaderComponent} from "../layouts/components/header/header.component";
import * as bcrypt from 'bcryptjs';
import {LoggedInGuard} from "../auth/guards/LoggedInGuard";
import {log} from "util";





@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public isLoggedIn: boolean;
  public tempIsLoggedIn: Observable<boolean> = this.isUserLoggedIn(); //Hilfsvariable für isLoggedIn, damit sie immer neu belegt wird und abfragt

  public usernameString: string;

  username: string;
  password: string;

  constructor(public router: Router, private loginService: LoginService, private tokenStorageService: TokenStorageService, private auth: AuthService,
               private toastService: MessageToastrService) {  }

  async ngOnInit()  {
    try {
      this.isLoggedIn = await this.tempIsLoggedIn.toPromise();

      if (this.isLoggedIn) {
        this.getUsernameFromJWT();
      }
    } catch (e) {
      this.isLoggedIn = false;
    }
  }

  isUserLoggedIn(): Observable<boolean> {
    return this.auth.isAuthenticated();
  }

  getUsernameFromJWT(){
    this.auth.getUsername().subscribe((response) => {
      this.usernameString = response.username;
    });
  }


  /**
   * Anmelden bei richtigen Einloggdaten
   *
   */

  loginUser() {

    // Leere Eingaben abfangen
    if(this.username == undefined || this.username == '') {

      this.loginFailed('Es wurde kein Benutzername eingegeben.', 'Login fehlgeschlagen');

    } else if(this.password == undefined || this.password == '') {

      this.loginFailed('Es wurde kein Passwort eingegeben.', 'Login fehlgeschlagen');

    } else {

      const user: UserLogin = {
        username : this.username,
        password : this.password
      };

      this.loginService.getHashFromUsername(user.username).subscribe(response => {

        if(response.hash !== undefined) {

          const hash = response.hash;
          const isPasswordValid = bcrypt.compareSync(user.password, hash);

          if(isPasswordValid) {

            this.loginService.getTokenForUser(user.username).subscribe((response) => {

              if (response.success) {

                // Belege Variablen für login.html
                this.isLoggedIn = true;
                this.usernameString = response.username; // Belege Angemeldet als:"Username"

                this.tokenStorageService.saveToken(response.jwt); // Ausgelagert in TokenStorageService
                // key ist 'token' gespeichert im Browser Local Storage unter untersuchen -> application -> Storage
                // Navigate erfolgt nur wenn im LoggedInGuard korrekt auf JWT überprüft wird ( CanAktivate)

                this.toastService.showToastr('Sie haben sich erfolgreich angemeldet', 'Anmeldung erfolgreich', 'success');
                //this.loginSuccessful = true;
                window.location.reload();

              } else {
                //Token nicht bekommen
                // EXCEPTION
              }
            })
          } else {
            this.loginFailed('Das eingegebene Passwort ist falsch.', 'Login fehlgeschlagen');
          }
        } else {
          this.loginFailed('Der eingegebene Benutzer exisitert nicht.', 'Login fehlgeschlagen');
        }
      });
    }
  }

  /**
   * Methode loggt akutellen user aus, indem er Token aus LocalStorage enzieht. Danach Routing zur Hauptseite
   */

  logoutUser() {
    this.tokenStorageService.deleteToken();
    this.isLoggedIn = false;
    this.password = "";
    this.username = "";
    window.location.reload();
    this.toastService.showToastr("Sie haben sich erfolgreich abgemeldet.", "Abmeldung erfolgreich", "success");
  }


  /**
   * Fehlermeldung ausgeben, wenn Anmeldung fehlgeschlagen ist
   * @param message Message für ToastService
   * @param title Title für ToastService
   */

  loginFailed(message: string, title: string) {
    this.toastService.showToastr(message, title, 'error');

    this.password = "";
  }

}



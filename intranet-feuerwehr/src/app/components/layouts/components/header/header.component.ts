import { NgModule } from '@angular/core';
import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import {Router, NavigationEnd} from "@angular/router";
import {AuthService} from "../../../auth/services/auth.service";
import {Observable} from "rxjs";
import { UserLogin } from 'src/app/components/shared/user';
import {AuthorizationService} from "../../../auth/services/authorization.service";
import { TokenStorageService } from 'src/app/components/auth/services/token-storage.service';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

const uiModules = [
  MatSidenavModule,
  MatIconModule,
  MatButtonModule
];

@NgModule({
  imports: uiModules,
  exports: uiModules
})
export class AppUiModule { }

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public isAdmin: boolean;
  public tempIsAdmin: Observable<boolean> = this.isUserAdmin(); //Hilfsvariable für isAdmin, damit sie immer neu belegt wird und abfragt

  public isAuthenticated: boolean;
  public tempIsLoggedIn: Observable<boolean> = this.isLoggedIn(); //Hilfsvariable für isAdmin, damit sie immer neu belegt wird und abfragt
  public isMenuOpen: boolean = false;

  public menuOpen(): void {
    if(this.isMenuOpen == true) {
      this.isMenuOpen = false;
    } else {
      this.isMenuOpen = true;
    }
  }

  public showContainer: boolean;


  constructor(private router: Router, public authService: AuthService, public tokenstorageService: TokenStorageService,
              public breakpointObserver: BreakpointObserver) {}


  async ngOnInit()  {

    // Belege isLogged vom Observable<boolean>
    try {
      this.isAuthenticated = await this.tempIsLoggedIn.toPromise();
    } catch (e) {
      this.isAuthenticated = false;
    }

    // Belege isAdmin vom Observable<boolean>
    try {
      this.isAdmin = await this.tempIsAdmin.toPromise();
    } catch (e) {
      this.isAdmin = false;
    }

    this.breakpointObserver
      .observe(['(max-width: 900px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.showContainer = true;
        } else {
          this.showContainer = false;
        }
      });
  }

  isUserAdmin(): Observable<boolean> {
    return this.authService.isAdmin();
  }

  isLoggedIn(): Observable<boolean> {
    return this.authService.isAuthenticated();
  }


}

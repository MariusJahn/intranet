import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthService} from '../services/auth.service';
import {Observable} from 'rxjs';
@Injectable({providedIn:'root'})
export class LoggedInGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router) {}

  // Interface Methode für CanActivate im App Routing, ob User angemeldet ist.
  canActivate(): Observable<boolean> {
    // Prüft durch JWT im backend ? ob JWT zugelassen und User gültig angemeldet ist
    return this.auth.isAuthenticated();
  }

}


import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthService} from '../services/auth.service';
import {Observable} from 'rxjs';
@Injectable({providedIn:'root'})
export class IsAdminGuard implements CanActivate {

  constructor(
    private auth: AuthService) {}

  // Interface Methode für CanActivate im App Routing, ob User Admin ist
  canActivate(): Observable<boolean> {
    // Prüft ob angemeldet ist. (auth-token zugelassen)
    try {
      if (this.auth.isAuthenticated()) {
        // Prüft im Service ob JWT Token isAdmin:true enthält
        return this.auth.isAdmin();
      }
    } catch (e) {
      console.log(e)
    }
  }

}

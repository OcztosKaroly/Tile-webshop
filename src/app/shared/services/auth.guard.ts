import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor (private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean {

      const user = JSON.parse(localStorage.getItem('user') as string);
      if (user) {
        return true;
      }
      this.router.navigateByUrl('/login');
      return false;
  }
}

/*export const authGuard: CanActivateFn = (route, state) => {
  const user = JSON.parse(localStorage.getItem('user') as string);

  if (user) {
    return true;
  }
  return false;
};*/
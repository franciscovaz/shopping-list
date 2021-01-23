import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot) : boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    // take the latest user and unsubscribe
    // nao vai estar sempre a escuta
    return this.authService.user.pipe(
      take(1),
      map( user => {
      const isAuth = !!user;
      if(isAuth) {
        return !!user;
      }
      return this.router.createUrlTree(['/auth']);
    })
    // 'old' way
      /* tap(isAuth => {
        if(!isAuth) {
          this.router.navigate(['/auth']);
        }
      }) */
    )
  }
}

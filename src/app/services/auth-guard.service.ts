import {inject, Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
class AuthGuardService {

  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot ) : (Observable<boolean | UrlTree>) {

    let isLoggedIn = false;

    let authSubscription = this.authService.isLoggedIn().subscribe((loggedIn:boolean) => {
      isLoggedIn = loggedIn;
    })
    authSubscription.unsubscribe();

    return new Observable<boolean | UrlTree>(observer => {
      if (isLoggedIn)
        observer.next(true);
      observer.next(this.router.createUrlTree(['/']));
    })

  }

}

export const canActivate: CanActivateFn = (route:ActivatedRouteSnapshot, state:RouterStateSnapshot) => {
  return inject(AuthGuardService).canActivate(route, state);
}

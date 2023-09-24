import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService:AuthService, private router:Router){

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const routeName = route.data['name'];
    if(this.authService.isLoggedIn()  && this.authService.hasPermission(routeName) )
    {
      return true;
    }
    else{
      this.router.navigate(['login'])
      return false;
    }

  }

}

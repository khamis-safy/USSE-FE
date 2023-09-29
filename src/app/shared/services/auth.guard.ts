import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { AuthService } from './auth.service';
import { PermissionsService } from './permissions.service';
import { __values } from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  isAllowed:boolean;
  constructor(private authService:AuthService,
    private router:Router,
    private permissionService:PermissionsService)
    {

  }
async  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const routeName = route.data['name'];
    const customerId=localStorage.getItem("customerId");
      const email =localStorage.getItem("email")
    if(routeName==="verification"){
      if(email){
        return true
      }
      else{
        this.router.navigate(['login'])

        return false
      }
    }
    else{


      if(customerId){

        if(customerId!=""){

          this.authService.setUserDataObservable(this.permissionService.getUserByEmail(email));
        }
      }
     await this.authService.hasPermission(routeName).then((__values)=>this.isAllowed=__values)
      if(this.authService.isLoggedIn() && this.isAllowed )
      {
        console.log("from guard",this.isAllowed)
        return true;
      }
      else{
        this.router.navigate(['login'])
        return false;
      }
    }

  }

}

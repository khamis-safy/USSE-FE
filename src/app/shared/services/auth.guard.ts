import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { AuthService } from './auth.service';
import { PermissionsService } from './permissions.service';
import { __values } from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  isAllowed:boolean=true;
  constructor(private authService:AuthService,
    private router:Router,
    private permissionService:PermissionsService)
    {

  }
async  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const routeName = route.data['name'];
    if(routeName==="verification"){
      if(this.authService.getFromValue()){
        return true
      }
      else{
        this.authService.clearUserInfo();
        this.router.navigate(['login'])

        return false
      }
    }
    if(routeName==="change-Passward"){
      if(this.authService.getAccessToReset()){
        return true

      }
      else{
        this.authService.clearUserInfo();
        this.router.navigate(['login'])
        return false

      }
    }

    if(this.authService.checkExistenceAndValidation()){

      await this.authService.loadUserInfo().then(() => true);
      
      if(this.authService.isLoggedIn()){
        const customerId=this.authService.getUserInfo()?.customerId;
        const email =this.authService.getUserInfo()?.email;
        if(customerId){

          if(customerId!="" ){
            this.authService.setUserDataObservable(this.permissionService.getUserByEmail(email));
            await this.authService.hasPermission(routeName).then((__values)=>this.isAllowed=__values)
          }
        }
        if( this.isAllowed )
        {
          return true;
        }
        else if(!this.isAllowed)
        {
          this.router.navigate(['messages'])
          return false;
        }
        else{
          this.authService.clearUserInfo();
          this.router.navigate(['login'])
          return false;
        }
      }
      else{
        this.authService.clearUserInfo();
        this.router.navigate(['login'])
        return false;
      }
    }
    else{
      this.authService.clearUserInfo();
      this.router.navigate(['login'])
      return false;
    }
  }
 
  

}

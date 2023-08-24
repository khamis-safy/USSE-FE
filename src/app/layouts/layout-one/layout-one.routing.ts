import { Routes, RouterModule } from '@angular/router';
//import { AuthComponent } from 'src/app/pages/auth/component/auth.component';
import { LayoutOneComponent } from './layout-one.component';
import { AuthGuard } from 'src/app/shared/services/auth.guard';

const routes: Routes = [
  {
    path:"",
    component:LayoutOneComponent,
    children:[
      {
        path: "login",

        loadChildren:()=>
        import("./../../pages/login/login.module").then((m)=>m.LoginModule)
      },
      {
        path: "signup",
        loadChildren:()=>
        import("./../../pages/signup/signup.module").then((m)=>m.SignupModule)
      },
      {
        path: "verification",
        canActivate:[AuthGuard],
        loadChildren:()=>
        import("./../../pages/login/components/verify/verify.module").then((m)=>m.VerifyModule)
      }
    ]
  }
];

export const LayoutOneRoutes = RouterModule.forChild(routes);

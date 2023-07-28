import { Routes, RouterModule } from '@angular/router';
//import { AuthComponent } from 'src/app/pages/auth/component/auth.component';
import { LayoutOneComponent } from './layout-one.component';

const routes: Routes = [
  {
    path:"",
    component:LayoutOneComponent,
    children:[
      // {
      //   path: "auth",
      //   loadChildren: () =>
      //     import("./../../pages/auth/auth.module").then((m) => m.AuthModule),
      // },
      // {
      //   path: "signup",
      //   loadChildren: () =>
      //     import("./../../pages/signup/signup.module").then((m) => m.SignupModule),
      // }

    ]
  }
];

export const LayoutOneRoutes = RouterModule.forChild(routes);

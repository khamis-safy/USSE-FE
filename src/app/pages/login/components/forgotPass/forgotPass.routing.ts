import { Routes, RouterModule } from '@angular/router';
import { ForgotPassComponent } from './forgotPass.component';

const routes: Routes = [
  {
    path: "",
    component: ForgotPassComponent,
  },
];

export const ForgotPassRoutes = RouterModule.forChild(routes);

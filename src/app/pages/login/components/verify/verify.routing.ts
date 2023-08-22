import { Routes, RouterModule } from '@angular/router';
import { VerifyComponent } from './verify.component';

const routes: Routes = [
  {
    path: "",
    component: VerifyComponent,
  },
];

export const VerifyRoutes = RouterModule.forChild(routes);

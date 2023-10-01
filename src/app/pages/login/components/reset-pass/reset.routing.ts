import { Routes, RouterModule } from '@angular/router';
import { ResetPassComponent } from './reset-pass.component';

const routes: Routes = [
  {
    path: "",
    component: ResetPassComponent,
  },
];

export const ResetPassRoutes = RouterModule.forChild(routes);

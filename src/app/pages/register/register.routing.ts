import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './component/register.component';

const routes: Routes = [
  {
    path: "",
    component: RegisterComponent,
  },
];

export const RegisterRoutes = RouterModule.forChild(routes);

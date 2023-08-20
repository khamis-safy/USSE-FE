import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './component/users.component';

const routes: Routes = [
  {
    path: "",
    component: UsersComponent,
  },
];

export const UsersRoutes = RouterModule.forChild(routes);

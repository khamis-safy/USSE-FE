import { Routes, RouterModule } from '@angular/router';
import { ListDetailsComponent } from './component/list-details.component';

const routes: Routes = [
  {
    path: "",
    component: ListDetailsComponent,
  },
];

export const LisDetailsRoutes = RouterModule.forChild(routes);

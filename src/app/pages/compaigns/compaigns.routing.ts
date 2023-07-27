import { Routes, RouterModule } from '@angular/router';
import { CompaignsComponent } from './component/compaigns.component';

const routes: Routes = [
  {
    path: "",
    component: CompaignsComponent,
  },
];

export const CompaignsRoutes = RouterModule.forChild(routes);

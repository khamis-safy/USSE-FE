import { Routes, RouterModule } from '@angular/router';
import { CompaignsDetailsComponent } from './component/compaignsDetails.component';

const routes: Routes = [
  {
    path: "",
    component: CompaignsDetailsComponent,
  },
];

export const CompaignsDetailsRoutes = RouterModule.forChild(routes);

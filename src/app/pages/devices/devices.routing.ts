import { Routes, RouterModule } from '@angular/router';
import { DevicesComponent } from './component/devices.component';

const routes: Routes = [
  {
    path: "",
    component: DevicesComponent,
  },
];

export const DevicesRoutes = RouterModule.forChild(routes);

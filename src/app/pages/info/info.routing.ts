import { Routes, RouterModule } from '@angular/router';
import { InfoComponent } from './component/info/info.component';


const routes: Routes = [
  {
    path: "",
    component: InfoComponent,
  },
];

export const InfoRoutes = RouterModule.forChild(routes);

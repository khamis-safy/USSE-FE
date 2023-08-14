import { Routes, RouterModule } from '@angular/router';
import { TemplatesComponent } from './component/templates.component';

const routes: Routes = [
  {
    path: "",
    component: TemplatesComponent,
  },
];

export const TemplatesRoutes = RouterModule.forChild(routes);

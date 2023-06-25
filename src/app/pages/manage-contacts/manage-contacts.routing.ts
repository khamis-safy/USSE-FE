import { Routes, RouterModule } from '@angular/router';
import { ManageContactsComponent } from './component/manage-contacts.component';

const routes: Routes = [
  {
    path: "",
    component: ManageContactsComponent,
  },
];

export const ManageContactsRoutes = RouterModule.forChild(routes);

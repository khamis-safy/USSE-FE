import { Routes, RouterModule } from '@angular/router';
import { LayoutTwoComponent } from './layout-two.component';

const routes: Routes = [
  {
    path:"",
    component:LayoutTwoComponent,
    children:[
      {
        path: "messages",
        loadChildren: () =>
          import("./../../pages/messages/messages.module").then((m) => m.MessagesModule),
      },
      {
        path: "contacts",
        loadChildren: () =>
          import("./../../pages/manage-contacts/manage-contacts.module").then((m) => m.ManageContactsModule),
      }

    ]
  }
];
export const LayoutTwoRoutes = RouterModule.forChild(routes);

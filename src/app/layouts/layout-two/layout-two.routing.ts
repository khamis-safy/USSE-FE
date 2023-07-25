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
      },
      {
        path: "list/:id",
        loadChildren: () =>
          import("./../../pages/manage-contacts/components/lists/list-details/list-details.module").then((m) => m.ListDetailsModule),
      },
      {
        path: "devices",
        loadChildren: () =>
          import("./../../pages/devices/devices.module").then((m) => m.DevicesModule),
      },
      {
        path: "message",
        loadChildren: () =>
          import("./../../pages/message/message.module").then((m) => m.MessageModule),
      }

    ]
  }
];
export const LayoutTwoRoutes = RouterModule.forChild(routes);

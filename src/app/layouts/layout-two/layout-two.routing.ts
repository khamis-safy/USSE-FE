import { Routes, RouterModule } from '@angular/router';
import { LayoutTwoComponent } from './layout-two.component';

const routes: Routes = [
  {
    path: "",
    component: LayoutTwoComponent,
    children: [
      {
        path: "messages",
        loadChildren: () =>
          import("./../../pages/messages/messages.module").then((m) => m.MessagesModule),
      },
      {
        path: "chats",
        loadChildren: () =>
          import("./../../pages/chats/chats.module").then((m) => m.ChatsModule)
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
        path: "users",
        loadChildren: () =>
          import("./../../pages/users/users.module").then((m) => m.UsersModule)
      },
      {
        path: "devices",
        loadChildren: () =>
          import("./../../pages/devices/devices.module").then((m) => m.DevicesModule),
      },


      {
        path: "compaigns",
        loadChildren: () =>
          import("./../../pages/compaigns/compaigns.module").then((m) => m.CompaignsModule),
      },
      {
        path: "compaign/:id",
        loadChildren:()=>
        import("./../../pages/compaigns/components/compaignsDetails/compaignsDetails.module").then((m)=>m.CompaignsDetailsModule)
      },
      {
        path: "templates",
        loadChildren:()=>
        import("./../../pages/templates/templates.module").then((m)=>m.TemplatesModule)
      },






    ]
  }
];
export const LayoutTwoRoutes = RouterModule.forChild(routes);

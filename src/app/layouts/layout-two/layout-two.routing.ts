import { Routes, RouterModule } from '@angular/router';
import { LayoutTwoComponent } from './layout-two.component';
import { AuthGuard } from 'src/app/shared/services/auth.guard';

const routes: Routes = [
  {
    path: "",
    component: LayoutTwoComponent,
    children: [
      {
        path: "messages",
        canActivate:[AuthGuard],

        loadChildren: () =>
          import("./../../pages/messages/messages.module").then((m) => m.MessagesModule),
      },
      {
        path: "chats",
        canActivate:[AuthGuard],

        loadChildren: () =>
          import("./../../pages/chats/chats.module").then((m) => m.ChatsModule)
      },
      {
        path: "contacts",
        canActivate:[AuthGuard],data:{name:"Contacts"},

        loadChildren: () =>
          import("./../../pages/manage-contacts/manage-contacts.module").then((m) => m.ManageContactsModule),
      },
      {
        path: "list/:id",
        canActivate:[AuthGuard],

        loadChildren: () =>
          import("./../../pages/manage-contacts/components/lists/list-details/list-details.module").then((m) => m.ListDetailsModule),
      },
      {
        path: "users",
        canActivate:[AuthGuard],data:{name:"Users"},

        loadChildren: () =>
          import("./../../pages/users/users.module").then((m) => m.UsersModule)
      },
      {
        path: "devices",
        canActivate:[AuthGuard],data:{name:"Devices"},

        loadChildren: () =>
          import("./../../pages/devices/devices.module").then((m) => m.DevicesModule),
      },


      {
        path: "compaigns",
        // canActivate:[AuthGuard],

        loadChildren: () =>
          import("./../../pages/compaigns/compaigns.module").then((m) => m.CompaignsModule),
      },
      {
        path: "compaign/:id",
        canActivate:[AuthGuard],

        loadChildren:()=>
        import("./../../pages/compaigns/components/compaignsDetails/compaignsDetails.module").then((m)=>m.CompaignsDetailsModule)
      },
      {
        path: "templates",
        canActivate:[AuthGuard],data:{name:"Templates"},

        loadChildren:()=>
        import("./../../pages/templates/templates.module").then((m)=>m.TemplatesModule)
      },






    ]
  }
];
export const LayoutTwoRoutes = RouterModule.forChild(routes);

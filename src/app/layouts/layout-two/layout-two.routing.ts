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
        path: "compaigns",
        loadChildren: () =>
          import("./../../pages/compaigns/compaigns.module").then((m) => m.CompaignsModule),
      } ,
      {
        path: "templates",
        loadChildren:()=>
        import("./../../pages/templates/templates.module").then((m)=>m.TemplatesModule)
      }



    ]
  }
];
export const LayoutTwoRoutes = RouterModule.forChild(routes);

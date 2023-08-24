import { Routes, RouterModule } from '@angular/router';
import { ChatsComponent } from './component/chats.component';

const routes: Routes = [
  {
    path: "",
    component: ChatsComponent,
  },
];

export const ChatsRoutes = RouterModule.forChild(routes);

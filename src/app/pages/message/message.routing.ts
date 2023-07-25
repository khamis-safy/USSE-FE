import { Routes, RouterModule } from '@angular/router';
import { MessageComponent } from './component/message.component';

const routes: Routes = [
  {
    path: "",
    component: MessageComponent,
  },
];

export const MessageRoutes = RouterModule.forChild(routes);

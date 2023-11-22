import { Routes, RouterModule } from '@angular/router';
import { BotComponent } from './component/bot/bot.component';

const routes: Routes = [
  {
    path: "",
    component: BotComponent,
  },
];

export const BotRoutes = RouterModule.forChild(routes);

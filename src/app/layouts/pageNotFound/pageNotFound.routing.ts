import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './pageNotFound.component';

const routes: Routes = [
 {path:'**' , component:PageNotFoundComponent}
];
export const PageNotFoundRoutes = RouterModule.forChild(routes);

import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { LayoutsModule } from './layouts/layouts.module';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'messages' },
  {
    path: "",
    loadChildren: () =>
      import("./layouts/layouts.module").then((m) => m.LayoutsModule)

    },
  { path: "**", redirectTo: "pages" }
];

const config: ExtraOptions = {
  useHash: false,
};
@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

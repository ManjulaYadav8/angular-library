import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseSettingsComponent } from './base-settings/base-settings.component';

const routes: Routes = [
  { path: '', component: BaseSettingsComponent },
  {
    path: 'general',
    loadChildren: () =>
      import('./general-settings/general-settings.module').then(
        (m) => m.GeneralSettingsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}

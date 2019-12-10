import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThankYouScreenPage } from './thank-you-screen.page';

const routes: Routes = [
  {
    path: '',
    component: ThankYouScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThankYouScreenPageRoutingModule {}

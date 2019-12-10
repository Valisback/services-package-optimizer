import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ThankYouScreenPageRoutingModule } from './thank-you-screen-routing.module';

import { ThankYouScreenPage } from './thank-you-screen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ThankYouScreenPageRoutingModule
  ],
  declarations: [ThankYouScreenPage]
})
export class ThankYouScreenPageModule {}

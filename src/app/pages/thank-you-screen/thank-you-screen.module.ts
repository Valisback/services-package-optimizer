import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ThankYouScreenPageRoutingModule } from './thank-you-screen-routing.module';
import {GenericModule} from 'src/app/shared/components/generic/generic.module';

import { ThankYouScreenPage } from './thank-you-screen.page';
import { ModalPage } from './component/modal/modal.page';


@NgModule({
  imports: [
    CommonModule,
    GenericModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ThankYouScreenPageRoutingModule
  ],
  declarations: [ThankYouScreenPage, ModalPage],
  entryComponents: [ModalPage],

})
export class ThankYouScreenPageModule {}

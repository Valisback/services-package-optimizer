import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { ModalPageRoutingModule } from './modal-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalPage } from './modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ModalPageRoutingModule
  ],
  declarations: []
})
export class ModalPageModule {}

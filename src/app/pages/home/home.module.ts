import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatStepperModule } from '@angular/material';

import { HomePage } from './home.page';
import {GenericModule} from 'src/app/shared/components/generic/generic.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatStepperModule,
    GenericModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage]
})
export class HomePageModule {}

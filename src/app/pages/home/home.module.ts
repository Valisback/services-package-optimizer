import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MatStepperModule } from '@angular/material';
import { LoginPage } from '../login/login.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import {GenericModule} from 'src/app/shared/components/generic/generic.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatStepperModule,
    ReactiveFormsModule,
    GenericModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, LoginPage],
  entryComponents: [LoginPage],

})
export class HomePageModule {}

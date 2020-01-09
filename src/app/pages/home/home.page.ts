import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as typeformEmbed from '@typeform/embed';
import { ApiCallsService } from '../../shared/api-calls/api-calls.service';
import { NavController, IonContent } from '@ionic/angular';

import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild(IonContent, {static: false}) content: IonContent;

  title = 'Is your enterprise ready to apply innovation?';
  subtitle = 'In this ever evolving world,'
  FORM_ID = 'hs1e1S';
  tag;

  constructor(
    private apicallsService: ApiCallsService,
    private navCtrl: NavController,
  ) {}

  ngAfterViewInit(): void {
    //this.openSurvey();
    

  }

  openSurvey() {
    this.tag = this.generateId();
    const popup = typeformEmbed.makePopup(
      'https://aienewyork.typeform.com/to/' + this.FORM_ID + '?tag=' + this.tag.toString(), // URL of the typeform
      {
        mode: 'popup',
        autoOpen: true,
        hideHeaders: false,
        hideFooters: false,
        onSubmit: (eleme) => {
          this.navCtrl.navigateRoot('thank-you-screen?tag=' + this.tag.toString());
          popup.close();

        }
      }
    );
    popup.open();

  }

  retrieveResults() {
    this.apicallsService.getAllForms().subscribe((res) => {
      console.log(res);
    });
  }

  generateId() {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + s4() + s4() + s4();
  }

  ScrollToBottom(height: number) {
    this.content.scrollToPoint(0, height, 600);
    }
}

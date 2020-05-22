import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import * as typeformEmbed from "@typeform/embed";
import { ApiCallsService } from "../../shared/api-calls/api-calls.service";
import { NavController, IonContent } from "@ionic/angular";
import { ModalController } from "@ionic/angular";
import { LoginPage } from "../login/login.page";
import * as firebase from "firebase/app";
require("firebase/auth");
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements AfterViewInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;

  title = "How can we make your life easier?";
  subtitle = "Welcome to Edison,";
  FORM_ID = "u3x1da";
  tag;

  constructor(
    private apicallsService: ApiCallsService,
    private navCtrl: NavController,
    public modalController: ModalController
  ) {}

  ngAfterViewInit(): void {}

  openSurvey() {
    this.tag = this.generateId();
    const popup = typeformEmbed.makePopup(
      "https://arendtjulia.typeform.com/to/" +
        this.FORM_ID +
        "?tag=" +
        this.tag.toString(), // URL of the typeform
      {
        mode: "popup",
        autoOpen: true,
        hideHeaders: false,
        hideFooters: false,
        onSubmit: (eleme) => {
          this.navCtrl.navigateRoot(
            "home"
            //"thank-you-screen?tag=" + this.tag.toString()
          );
          popup.close();
        },
      }
    );
    popup.open();
  }

  openLogin() {
    if (firebase.auth().currentUser) {
      this.openSurvey();
    } else {
      const cssClass = "img-modal-css login";
      this.presentModal(cssClass).then((data) => {
        console.log(data);
        if (data.authenticated) {
          this.openSurvey();
        }
      });
    }
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
    };
    return s4() + s4() + s4() + s4() + s4();
  }

  ScrollToBottom(height: number) {
    this.content.scrollToPoint(0, height, 600);
  }

  async presentModal(cssClass: string) {
    const modal = await this.modalController.create({
      component: LoginPage,
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: cssClass,
      mode: "md",
      componentProps: {
        modalController: this.modalController,
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    return data;
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { User } from './model/user';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import * as firebase from 'firebase/app';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @Input() modalController: ModalController;
  infoFormGroup: FormGroup;


  public user: User = new User();

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
      this.infoFormGroup = this.formBuilder.group({
        // tslint:disable-next-line: max-line-length
        email: new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
        password: new FormControl('', [Validators.required]),
      });
  }

  login() {
    const data = Object.assign({}, this.infoFormGroup.value);
    this.user.email = data.email;
    this.user.password = data.password;

    this.authService.doLogin(this.user).then(fulfilled => {
      this.dismissModal();
      this.presentValidToast();
      this.infoFormGroup.reset();
    },
    rejected => {
      this.presentWrongToast();
      this.infoFormGroup.reset();
    });
  }

  dismissModal() {
    let userAuthenticated = false;
    const user = firebase.auth().currentUser;
    if (user) {
      userAuthenticated = true;
    }

    this.modalController.dismiss({
      dismissed: true,
      authenticated: userAuthenticated
    });
  }

  async presentValidToast() {
    const toast = await this.toastController.create({
      color: 'success',
      message: 'Successfully logged in.',
      closeButtonText: 'Ok',
      cssClass: 'validation-toast',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
        }
      ],
      duration: 2000
    });
    toast.present();

  }

  async presentWrongToast() {
    const toast = await this.toastController.create({
      color: 'danger',
      closeButtonText: 'Ok',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
        }
      ],
      cssClass: 'validation-toast',
      message: 'Wrong username/password configuration.',
      duration: 2000
    });
    toast.present();

  }

}

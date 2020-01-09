import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() title: string;
  @Input() learnMore = false;

  @Input() modalController: ModalController;
  @Input() jobTitle: string;
  @Input() organization: string;


  infoFormGroup: FormGroup;


  constructor(
    private db: AngularFireDatabase,
    private formBuilder: FormBuilder,
    public toastController: ToastController
  ) {
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    if ( this.learnMore ) {
      this.infoFormGroup = this.formBuilder.group({
        firstname: new FormControl('', [Validators.required]),
        lastname: new FormControl('', [Validators.required]),
        // tslint:disable: max-line-length
        email: new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
        message: new FormControl('', [Validators.required]),
  
      });

    } else {
      this.infoFormGroup = this.formBuilder.group({
        email: new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      });
    }
    
  }

  dismissModal() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  onSubmit() {
    const data = Object.assign({}, this.infoFormGroup.value);
    const email = data.email;
    const date = new Date();

    if (this.infoFormGroup.valid === false) {
      console.log('not valid', this.infoFormGroup);
      return;
    }

    if (this.learnMore) {
      const name = data.firstname + ' ' + data.lastname;
      const message = data.message;
 
      
      const html = `
      <div> From: ${name} </div>
      <div> Job Title: ${this.jobTitle} at ${this.organization} </div>
      <div> Email: <a href = "mailto: ${email}">${email}</a></div>
      <div> Date: ${date} </div>
      <div> Message: ${message} </div>
       `;

      const formRequest = { name, email , message, date, html };
      this.db.list('/messages').push(formRequest); 

    } else {

      const html = `
      <div> Email: <a href = "mailto: ${email}">${email}</a></div>
      <div> Date: ${date} </div>
       `;

      const formRequest = {email, date, html };
      this.db.list('/messages').push(formRequest); // Set a different db address for those specifc requests
    }

    this.dismissModal();
    this.infoFormGroup.reset();
    this.presentToast();

  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your message has been sent successfully.',
      duration: 2000
    });
    toast.present();

  }

}

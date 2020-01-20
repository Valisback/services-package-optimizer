import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'src/app/pages/login/model/user';
import * as firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    public afAuth: AngularFireAuth
  ) { }



  // doRegister is not currently used since users are created by the AIE and self-registration is not allowed
  doRegister(value: User) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
      }, err => reject(err));
    });
  }

  doLogin(value: User) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
      }, err => reject(err));
    });
  }

}

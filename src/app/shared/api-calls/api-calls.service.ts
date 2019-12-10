import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { AuthConfig , OAuthService } from 'angular-oauth2-oidc';
import { map, take } from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FormResponse } from '../models/formResponse';

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {

  formCollection: AngularFirestoreCollection<FormResponse>;
  forms: Observable<FormResponse[]>;
  lastForm: FormResponse;

  formOpened;
  formSubmitted;

  constructor(private http: HttpClient,
              private db: AngularFirestore,
              private oAuthService: OAuthService,
    ) {
      this.formCollection = this.db.collection<FormResponse>('Forms');
      this.forms = this.formCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map( a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data};
          });
        })
      );
    }

  getAllForms(): Observable<FormResponse[]> {
    return this.forms;
  }

  getFormFromTag(tag: string): Observable<FormResponse[]> {
    return this.db.collection<FormResponse>('Forms' , ref => ref.where('tag', '==', tag).limit(1)).snapshotChanges().pipe(
      map(actions => {
        return actions.map( a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data};
        });
      })
    );
  }
}

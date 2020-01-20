import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { AuthConfig , OAuthService } from 'angular-oauth2-oidc';
import * as firebase from 'firebase/app';
import { map, take } from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FormResponse } from '../models/formResponse';
import { ScoreData } from 'src/app/pages/thank-you-screen/models/scoreData';

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {

  formCollection: AngularFirestoreCollection<FormResponse>;
  processedFormCollection: AngularFirestoreCollection<FormResponse>;

  forms: Observable<FormResponse[]>;
  lastForm: FormResponse;

  formOpened;
  formSubmitted;

  constructor(private http: HttpClient,
              private db: AngularFirestore,
              private oAuthService: OAuthService,
    ) {
      this.formCollection = this.db.collection<FormResponse>('Forms');
      this.processedFormCollection = this.db.collection<FormResponse>('ProcessedForms');

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

  updateFormFromTag(id: any, organization: string, results: ScoreData[],
                    country: string, industry: string, jobTitle: string, businessProblem: string, genMaturity: number, genPriority: number) {


    const formattedRes = results.map((obj) =>  Object.assign({}, obj));
    if (firebase.auth().currentUser) { // We make the update only if the user is authenticated
      const data = {organization,
        country,
        industry,
        jobTitle,
        businessProblem,
        formattedRes,
        genMaturity,
        genPriority
      };
      this.formCollection.doc(id).update(data).then( ok => {
        console.log('db update completed');
      });
    }

  }
}

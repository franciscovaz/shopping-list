import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap, map } from "rxjs/operators";
import { environment } from "src/environments/environment";

import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

// Injectable para podermos fazer o inject das actions e do http!!
@Injectable()
export class AuthEffects {
  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      // switchMap permite return de um observable
      return this.http
        .post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          }
        ).pipe(
          map(resData => {
            // aqui tenho um login com sucesso (passou no request), logo vamos fazer o dispatch da login succes action
            const expirationDate = new Date(
              new Date().getTime() + +resData.expiresIn * 1000
            );

            // of() to create a new observable
            return of(new AuthActions.Login({
              email: resData.email,
              userId: resData.localId,
              token: resData.idToken,
              expirationDate: expirationDate
            }));
          }),
          catchError(error => {
            // temos que dar return de um non error observable para o effect nao morrer
            // of() to create a new observable
            // return an empty observable for now
            return of();
          })
        )
    })
  );

  constructor(private actions$: Actions, private http: HttpClient) { }
}

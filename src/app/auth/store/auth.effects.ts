import { HttpClient } from "@angular/common/http";
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
    ).pipe(catchError(error => {
      // temos que dar return de um non error observable para o effect nao morrer
      // of() to create a new observable
      of();
    }), map(resData => {
      // of() to create a new observable
      of();
    }))
    })
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}

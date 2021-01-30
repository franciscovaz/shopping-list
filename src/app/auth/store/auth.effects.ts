import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap, map, tap } from "rxjs/operators";
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
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START)
  );




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

            return new AuthActions.AuthenticateSuccess({
              email: resData.email,
              userId: resData.localId,
              token: resData.idToken,
              expirationDate: expirationDate
            });
          }),
          catchError(errorResp => {
            // temos que dar return de um non error observable para o effect nao morrer
            let errorMessage = 'An unkown error occurred!';
            if (!errorResp.error || !errorResp.error.error) {
              return of(new AuthActions.AuthenticateFail(errorMessage));
            }
            switch (errorResp.error.error.message) {
              case 'EMAIL_EXISTS':
                errorMessage = 'Email already used by another account!';
                break;
              case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist!';
                break;
              case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct!';
            }

            return of(new AuthActions.AuthenticateFail(errorMessage));

            // of() to create a new observable
            // return an empty observable for now
            return of();
          })
        )
    })
  );

  // quando um effect nao faz o dispatch de nova acao, coloca se dispatch: false
  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap(() => {
      this.router.navigate(['/']);
    })
  )

  constructor(private actions$: Actions, private http: HttpClient, private router: Router) { }
}

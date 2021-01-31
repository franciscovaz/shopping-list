import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap, map, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth.service";
import { User } from "../user.model";

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

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(
    new Date().getTime() + expiresIn * 1000
  );

  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));

  return AuthActions.authenticateSuccess({
    email,
    userId,
    token,
    expirationDate,
    redirect: true
  });
};

const handleError = (errorResp: any) => {
  let errorMessage = 'An unkown error occurred!';
  if (!errorResp.error || !errorResp.error.error) {
    return of(AuthActions.authenticatedFail({ errorMessage }));
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

  // of() to create a new observable
  return of(AuthActions.authenticatedFail({ errorMessage }));
};

// Injectable para podermos fazer o inject das actions e do http!!
@Injectable()
export class AuthEffects {

  authSignup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signupStart),
      switchMap((action) => {
        return this.http.post<AuthResponseData>
          ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
            {
              email: action.email,
              password: action.password,
              returnSecureToken: true
            }).pipe(
              tap(resData => {
                this.authService.setLogoutTimer(+resData.expiresIn * 1000);
              }),
              map(resData => {
                // aqui tenho um login com sucesso (passou no request), logo vamos fazer o dispatch da login succes action
                return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
              }),
              catchError(errorResp => {
                // temos que dar return de um non error observable para o effect nao morrer
                return handleError(errorResp);
              })
            )
      })
    )
  )





  @Effect()
  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginStart),
      switchMap((action) => {
        // switchMap permite return de um observable
        return this.http
          .post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
            {
              email: action.email,
              password: action.password,
              returnSecureToken: true
            }
          ).pipe(
            tap(resData => {
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            map(resData => {
              // aqui tenho um login com sucesso (passou no request), logo vamos fazer o dispatch da login succes action
              return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
            }),
            catchError(errorResp => {
              // temos que dar return de um non error observable para o effect nao morrer
              return handleError(errorResp);
            })
          )
      })
    )
  )

  authRedirect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.authenticateSuccess),
      tap((action) => {
        if (action.redirect) {
          this.router.navigate(['/']);
        }
      })
    ), { dispatch: false }
  )

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
          return { type: 'DUMMY' };
        }

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

        if (loadedUser.token) {
          const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();

          this.authService.setLogoutTimer(expirationDuration);
          // this.user.next(loadedUser);
          return AuthActions.authenticateSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false
          });
        }
        return { type: 'DUMMY' };
      })
    )
  );


  autoLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.authService.clearLogoutTimer();
        localStorage.removeItem('userData');
        this.router.navigate(['/auth']);
      })
    ), { dispatch: false }
  )

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }
}

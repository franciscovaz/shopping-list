import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {

  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAAnfTUecnPnxcgxo4uCnJZDnUBgmQn31M',
    {
      email,
      password,
      returnSecureToken: true
    }).pipe(
      catchError(this.handleError),
      tap( respData => {
        this.handleAuthentication(respData.email, respData.localId, respData.idToken, +respData.expiresIn);
      }

      ));

  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAAnfTUecnPnxcgxo4uCnJZDnUBgmQn31M',
    {
      email,
      password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError),
    tap(respData => {
      this.handleAuthentication(respData.email, respData.localId, respData.idToken, +respData.expiresIn);
    }));
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if(!userData) {
      return;
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

    if(loadedUser.token) {
      this.user.next(loadedUser);
    }
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiredIn: number) {
    const expirationDate = new Date(
      new Date().getTime() + expiredIn * 1000
    );
    const user = new User(
      email,
      userId,
      token,
      expirationDate
    );

    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResp: HttpErrorResponse) {
    let errorMessage = 'An unkown error occurred!';
        if(!errorResp.error || !errorResp.error.error) {
          return throwError(errorMessage);
        }
        switch(errorResp.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = 'Email already used by another account!';
            break;
          case 'EMAIL_NOT_FOUND':
            errorMessage = 'This email does not exist!';
            break;
          case 'INVALID_PASSWORD':
            errorMessage = 'This password is not correct!';
        }

        return throwError(errorMessage);
  }
}

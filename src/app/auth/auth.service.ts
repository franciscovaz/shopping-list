import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

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
  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAAnfTUecnPnxcgxo4uCnJZDnUBgmQn31M',
    {
      email,
      password,
      returnSecureToken: true
    }).pipe(
      catchError(this.handleError));

  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAAnfTUecnPnxcgxo4uCnJZDnUBgmQn31M',
    {
      email,
      password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError));
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

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
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
      catchError(errorResp => {
        let errorMessage = 'An unkown error occurred!';
        if(!errorResp.error || !errorResp.error.error) {
          return throwError(errorMessage);
        }
        switch(errorResp.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = 'Email already used by another account!';
        }

        return throwError(errorMessage);
      })
    )
  }
}

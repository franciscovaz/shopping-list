
import { Injectable } from "@angular/core";

import { Store } from "@ngrx/store";
import * as fromAppRoot from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // user = new BehaviorSubject<User>(null);

  private tokenExpirationTimer: any;

  constructor(private store: Store<fromAppRoot.AppState>) { }




  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(AuthActions.logout());
    }, expirationDuration)
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }


}

import { Component, ElementRef, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromAppRoot from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private store: Store<fromAppRoot.AppState>) { }

  ngOnInit() {
    this.store.dispatch(AuthActions.autoLogin());
  }
}

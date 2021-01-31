import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromAppRoot from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(
    private store: Store<fromAppRoot.AppState>) { }

  ngOnInit() {
    this.userSub = this.store.select('auth').pipe(map(
      authState => authState.user
    )).subscribe(
      userData => {
        // this.isAuthenticated = !userData ? false : true;
        this.isAuthenticated = !!userData;
      }
    );
  }


  onSaveData() {
    // this.dataStorage.storeRecipes();
    this.store.dispatch(new RecipesActions.StoreRecipes());
  }

  onFetchData() {
    // this.dataStorage.fetchRecipes().subscribe();
    this.store.dispatch(new RecipesActions.FetchRecipes());
  }

  onLogout() {
    // this.authService.logout();
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}

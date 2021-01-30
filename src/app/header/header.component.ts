import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';
import * as fromAppRoot from '../store/app.reducer';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(private dataStorage: DataStorageService, private authService: AuthService, private store: Store<fromAppRoot.AppState>) {}

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
    this.dataStorage.storeRecipes();
  }

  onFetchData() {
    this.dataStorage.fetchRecipes().subscribe();
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}

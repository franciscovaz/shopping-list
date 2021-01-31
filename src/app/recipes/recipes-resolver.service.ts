import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Recipe } from './recipe.model';
import * as fromAppRoot from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';
import { Actions, ofType } from '@ngrx/effects';
import { map, switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {

  constructor(
    private store: Store<fromAppRoot.AppState>,
    private actions$: Actions
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('recipes').pipe(
      take(1),
      map(recipesState => {
        return recipesState.recipes;
      }),
      switchMap(recipes => {
        if (recipes.length === 0) {
          this.store.dispatch(new RecipesActions.FetchRecipes());

          // take 1 para fazer o unsubscribe. So precisamos 1 vez
          // resolve retorna um observable logo precisamos do actions$ observable
          return this.actions$.pipe(
            ofType(RecipesActions.SET_RECIPES),
            take(1)
          );
        } else {
          return of(recipes);
        }

      }))

  }
}

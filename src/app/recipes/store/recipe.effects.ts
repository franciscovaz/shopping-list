import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, Effect, ofType } from "@ngrx/effects";
import { switchMap, map, withLatestFrom } from "rxjs/operators";
import { Recipe } from "../recipe.model";
import * as RecipesActions from './recipe.actions';
import * as fromAppRoot from '../../store/app.reducer';
import { Store } from "@ngrx/store";

@Injectable()
export class RecipeEffects {
  fetchRecipes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.fetchRecipes),
      switchMap(() => {
        return this.http.get<Recipe[]>(
          'https://shopping-list-angular-58afa-default-rtdb.firebaseio.com/recipes.json'
        )
      }),
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      map(recipes => {
        return RecipesActions.setRecipes({ recipes });
      })
    )
  )

  storeRecipes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.storeRecipes),
      withLatestFrom(this.store.select('recipes')),// merge a value from another observable to this one
      switchMap(([actionData, recipesState]) => {
        return this.http.put(
          'https://shopping-list-angular-58afa-default-rtdb.firebaseio.com/recipes.json', recipesState.recipes)
      })
    ), { dispatch: false }
  )

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromAppRoot.AppState>
  ) { }
}

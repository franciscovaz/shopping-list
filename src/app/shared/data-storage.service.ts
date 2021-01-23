import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { exhaustMap, map, take, tap } from 'rxjs/operators';;

import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();

    // nao retorno para subscrever no componente pois nao pretendo nenhum mecanismo de loading ou outro...
    this.http.put('https://shopping-list-angular-58afa-default-rtdb.firebaseio.com/recipes.json', recipes).subscribe(
      response => {
        console.log(response);
      }
    )
  }

  fetchRecipes() {
    // so executa uma vez, quando faz o fetch, nao fica a escuta
    // exaustMap permite ter 2 observables, espera que o 1 acabe
    return this.authService.user.pipe(
      take(1), exhaustMap(user => {
        return this.http.get<Recipe[]>('https://shopping-list-angular-58afa-default-rtdb.firebaseio.com/recipes.json', {
          params: new HttpParams().set('auth', user.token)
        });
      }),
      map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}

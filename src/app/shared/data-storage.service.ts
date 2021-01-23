import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';;

import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

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
    this.http.get<Recipe[]>('https://shopping-list-angular-58afa-default-rtdb.firebaseio.com/recipes.json')
    .pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
        })
      })
    )
    .subscribe(
      recipes => {
        this.recipeService.setRecipes(recipes);
      }
    )
  }
}
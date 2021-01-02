import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RecipeDetailComponent } from "./recipes/recipe-detail/recipe-detail.component";
import { RecipeItemComponent } from "./recipes/recipe-list/recipe-item/recipe-item.component";
import { RecipeListComponent } from "./recipes/recipe-list/recipe-list.component";
import { RecipesComponent } from "./recipes/recipes.component";
import { ShoppingEditComponent } from "./shopping-list/shopping-edit/shopping-edit.component";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";

const appRoutes: Routes = [
  {
    path: '', redirectTo: '/recipes', pathMatch: 'full'
  },
  {
    path: 'recipes', component: RecipesComponent, children: [
      {
        path: 'list', component: RecipeListComponent
      },
      {
        path: 'detail', component: RecipeDetailComponent
      },
      {
        path: 'item', component: RecipeItemComponent
      }
    ]
  },
  {
    path: 'shopping-list', component: ShoppingListComponent, children: [
      {
        path: 'edit', component: ShoppingEditComponent
      }
    ]
  }

]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

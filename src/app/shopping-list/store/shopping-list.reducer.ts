import { Action } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.model';
import { ADD_INGREDIENT } from './shopping-list.action';

const initialState = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 15),
    new Ingredient('Banana', 3)
  ]
};

export function shoppingListReduce(state = initialState, action: Action) {
  switch(action.type) {
    case ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action]
      }
  }
}

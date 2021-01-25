import { Action } from '@ngrx/store';
import { Ingredient } from '../shared/ingredient.model';

const initialState = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 15),
    new Ingredient('Banana', 3)
  ]
};

export function shoppingListReduce(state = initialState, action: Action) {
  switch(action.type) {
    case 'ADD_INGREDIENTS':
      return {
        ...state,
        ingredients: [...state.ingredients, action]
      }
  }
}

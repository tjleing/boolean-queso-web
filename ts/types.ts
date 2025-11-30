export enum IngredientType {
  BREAD,
  MEAT,
  VEGETABLE,
  CONDIMENT,
}

export interface Ingredient {
  name: string;
  cost: number;
  power: number;
  effect: (Sandwich) => void;
  type: IngredientType;
  effectText: string;
  flavorText: string;
}

export interface Animatable {
  animationDoneCallback: () => void;
  animate: () => void;
}

export class IngredientAddEvent {
  name: string;
  span: HTMLSpanElement;
}

export class IngredientEffectEvent {
  ing: Ingredient;
  span: HTMLSpanElement;
}

export type SandwichAnimateEvent = IngredientAddEvent | IngredientEffectEvent;

export interface SerializedSandwich {
  id: number;
  ingredients: string[];
}

export interface DeserializedSandwich {
  id: number;
  ingredients: Ingredient[];
}

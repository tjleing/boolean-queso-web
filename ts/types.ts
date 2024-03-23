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

export interface Sandwich {
    ingredients: Ingredient[];
    isClosed: boolean;
}
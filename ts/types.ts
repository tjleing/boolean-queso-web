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

export enum TurnState {
    SELECTING_DECK,
    TURN_ACTIVE,
    ANIMS_PLAYING,
    GAME_END
}

export interface Animatable {
    animationDoneCallback: () => void;
    animate: () => void;
}
interface Ingredient {
    cost: number;
    power: number;
    effect: (Sandwich) => void;
}

interface Sandwich {
    ingredients: Ingredient[];
    isClosed: boolean;
}
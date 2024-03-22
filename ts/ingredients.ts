const bacon: Ingredient = {
    cost: 1,
    power: 1,
    effect: (sandwich: Sandwich) => {
        sandwich.ingredients.map((ing) => {ing.power++; return ing;})
    },
}

const ingredients = new Map();
ingredients.set("bacon", bacon);

export {ingredients};
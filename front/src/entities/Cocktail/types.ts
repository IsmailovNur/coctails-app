export interface CocktailIngredient {
  name: string;
  quantity: string;
}

export interface Cocktail {
  _id: string;
  userId: string;
  name: string;
  image: string;
  recipe: string;
  isPublished: boolean;
  ingredients: CocktailIngredient[];
}

export interface CreateCocktailMutation {
  name: string;
  recipe: string;
  ingredients: CocktailIngredient[];
  image: File;
}

export interface PublishCocktailMutation {
  id: string;
  isPublished: boolean;
}

export interface DeleteCocktailResponse {
  message: string;
}

export interface GlobalError {
  error: string;
}
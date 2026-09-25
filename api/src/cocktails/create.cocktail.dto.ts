import { CocktailIngredients } from '../types.js';
import { IsNotEmpty } from 'class-validator';

export class CreateCocktailDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  recipe: string;

  @IsNotEmpty()
  ingredients: CocktailIngredients[] | string;
}


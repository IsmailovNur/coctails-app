import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CocktailIngredients } from '../types.js';

@Schema({ _id: false })
export class CocktailIngredient implements CocktailIngredients {
  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
  })
  quantity: string;
}

export const CocktailIngredientSchema = SchemaFactory.createForClass(CocktailIngredient);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CocktailIngredients } from '../types.js';
import { CocktailIngredientSchema } from './cocktailIngredient.schema.js';
import type { Document } from 'mongoose';

export type CocktailDocument = Cocktail & Document;

@Schema()
export class Cocktail {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  image: string;

  @Prop({
    required: true,
  })
  recipe: string;

  @Prop({
    required: true,
    default: false,
  })
  isPublished: boolean;

  @Prop({
    required: true,
    type: [CocktailIngredientSchema],
    validate: {
      validator: (value: CocktailIngredients[]) => value.length > 0,
      message: 'At least one ingredient is required!',
    },
  })
  ingredients: CocktailIngredients[];
}

export const CocktailSchema = SchemaFactory.createForClass(Cocktail);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CocktailIngredients } from '../types.js';

@Schema()
export class Cocktail {
  @Prop({
    required: true,
    unique: true,
    type: Types.ObjectId,
    ref: 'Users',
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
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
  })
  ingredients: CocktailIngredients[];
}

export const CocktailSchema = SchemaFactory.createForClass(Cocktail);

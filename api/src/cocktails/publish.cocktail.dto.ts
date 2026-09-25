import { IsBoolean } from 'class-validator';

export class PublishCocktailDto {
  @IsBoolean()
  isPublished: boolean;
}

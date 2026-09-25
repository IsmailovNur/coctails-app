import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CocktailDocument, Cocktail } from '../schemas/coctails.schema.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCocktailDto } from './create.cocktail.dto.js';
import { CocktailIngredients, RequestWithUser } from '../types.js';
import { PublishCocktailDto } from './publish.cocktail.dto.js';
import 'multer';

@Injectable()
export class CocktailsService {
  constructor(
    @InjectModel(Cocktail.name)
    private cocktailModel: Model<CocktailDocument>,
  ) {}

  private checkId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid cocktail ID!');
    }
  }

  async getPublished() {
    return this.cocktailModel.find({ isPublished: true }).sort({ name: 1 });
  }

  async getOne(id: string) {
    this.checkId(id);

    const cocktail = await this.cocktailModel.findOne({
      _id: id,
      isPublished: true,
    });

    if (!cocktail) {
      throw new NotFoundException('Cocktail not found!');
    }

    return cocktail;
  }

  async getMy(request: RequestWithUser) {
    if (!request.user) {
      throw new UnauthorizedException('Unauthenticated!');
    }

    return this.cocktailModel
      .find({ userId: request.user._id })
      .sort({ name: 1 });
  }

  async getAllForAdmin() {
    return this.cocktailModel.find().sort({ name: 1 });
  }

  async create(
    cocktailDto: CreateCocktailDto,
    uploadedFile: Express.Multer.File,
    request: RequestWithUser,
  ) {
    if (!request.user) {
      throw new UnauthorizedException('Unauthenticated!');
    }

    if (!cocktailDto.name.trim()) {
      throw new BadRequestException('Cocktail name is required!');
    }

    if (!cocktailDto.recipe.trim()) {
      throw new BadRequestException('Recipe is required!');
    }

    if (!uploadedFile) {
      throw new BadRequestException('Cocktail image is required!');
    }

    const ingredients = this.parseIngredients(cocktailDto.ingredients);

    const cocktail = new this.cocktailModel({
      userId: request.user._id,
      name: cocktailDto.name.trim(),
      image: `images/cocktails/${uploadedFile.filename}`,
      recipe: cocktailDto.recipe.trim(),
      isPublished: false,
      ingredients,
    });

    return cocktail.save();
  }

  async publish(id: string, publishDto: PublishCocktailDto) {
    this.checkId(id);

    const cocktail = await this.cocktailModel.findByIdAndUpdate(
      id,
      { isPublished: publishDto.isPublished },
      { returnDocument: 'after' },
    );

    if (!cocktail) {
      throw new NotFoundException('Cocktail not found!');
    }

    return cocktail;
  }

  async delete(id: string, request: RequestWithUser) {
    this.checkId(id);

    if (!request.user) {
      throw new UnauthorizedException('Unauthenticated!');
    }

    const cocktail = await this.cocktailModel.findById(id);

    if (!cocktail) {
      throw new NotFoundException('Cocktail not found!');
    }

    const isOwner = cocktail.userId.equals(request.user._id);

    const isAdmin = request.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You can delete only your own cocktails!');
    }

    await cocktail.deleteOne();

    return { message: 'Cocktail deleted!' };
  }

  private parseIngredients(
    ingredients: CocktailIngredients[] | string,
  ): CocktailIngredients[] {
    let parsedIngredients: unknown = ingredients;

    if (typeof ingredients === 'string') {
      try {
        parsedIngredients = JSON.parse(ingredients);
      } catch {
        throw new BadRequestException(
          'Ingredients must be a valid JSON array!',
        );
      }
    }

    if (!Array.isArray(parsedIngredients) || parsedIngredients.length === 0) {
      throw new BadRequestException('At least one ingredient is required!');
    }

    return parsedIngredients.map((ingredient, index) => {
      if (!ingredient || typeof ingredient !== 'object') {
        throw new BadRequestException(
          `Incorrect ${index + 1}/ ingredient type!`,
        );
      }

      const item = ingredient as Record<string, unknown>;
      const name = typeof item.name === 'string' ? item.name.trim() : '';
      const quantity =
        typeof item.quantity === 'string' ? item.quantity.trim() : '';

      if (!name || !quantity) {
        throw new BadRequestException(
          `Ingredient ${index + 1}/ must contain name and quantity!`,
        );
      }

      return { name, quantity };
    });
  }
}

import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppService } from './app.service.js';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users/users.controller.js';
import { AuthGuard } from './middlewares/auth.guard.js';
import { RolesGuard } from './middlewares/roles.guard.js';
import { User, UserSchema } from './schemas/user.schema.js';
import { CocktailsController } from './cocktails/cocktails.controller.js';
import { Cocktail, CocktailSchema } from './schemas/coctails.schema.js';
import { CocktailsService } from './cocktails/cocktails.service.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/cocktails'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Cocktail.name, schema: CocktailSchema },
    ]),
  ],

  controllers: [UsersController, CocktailsController],

  providers: [AppService, AuthGuard, RolesGuard, CocktailsService],
})
export class AppModule {}

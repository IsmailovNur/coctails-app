import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppService } from './app.service.js';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users/users.controller.js';
import { AuthGuard } from './middlewares/auth.guard.js';
import { RolesGuard } from './middlewares/roles.guard.js';
import { User, UserSchema } from './schemas/user.schema.js';
import { CocktailsController } from './cocktails/cocktails.controller.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/tune'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],

  controllers: [
    UsersController,
    CocktailsController,
  ],

  providers: [AppService, AuthGuard, RolesGuard],
})
export class AppModule {}

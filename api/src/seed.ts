import mongoose from 'mongoose';
import { User, UserSchema } from './schemas/user.schema.js';
import { Cocktail, CocktailSchema } from './schemas/coctails.schema.js';
import { randomUUID } from 'node:crypto';

const mongoDbUrl = 'mongodb://localhost/cocktails';

const run = async () => {
  await mongoose.connect(mongoDbUrl);

  const UserModel = mongoose.model<User>(User.name, UserSchema);
  const CocktailModel = mongoose.model<Cocktail>(Cocktail.name, CocktailSchema);

  try {
    await CocktailModel.deleteMany({});
    await UserModel.deleteMany({});

    const admin = await new UserModel({
      username: 'admin',
      displayName: 'Administrator',
      email: 'admin@example.com',
      avatar: 'images/no-image.svg',
      password: '1234',
      role: 'admin',
      token: randomUUID(),
      googleId: null,
    }).save();

    const user = await new UserModel({
      username: 'user',
      displayName: 'Regular User',
      email: 'user@example.com',
      avatar: 'images/no-image.svg',
      password: '1234',
      role: 'user',
      token: randomUUID(),
      googleId: null,
    }).save();

    await new CocktailModel({
      userId: admin._id,
      name: 'Margarita',
      image: 'images/no-image.svg',
      recipe:
        'Shake tequila, lime juice and triple sec with ice. Strain into a glass.',
      isPublished: true,
      ingredients: [
        {
          name: 'Tequila',
          quantity: '50 ml',
        },

        {
          name: 'Lime juice',
          quantity: '25 ml',
        },

        {
          name: 'Triple sec',
          quantity: '20 ml',
        },

        {
          name: 'Ice',
          quantity: 'as needed',
        },
      ],
    }).save();

    await new CocktailModel({
      userId: user._id,
      name: 'Mojito',
      image: 'images/no-image.svg',
      recipe:
        'Muddle mint with lime and sugar, add rum and ice, then add soda water.',
      isPublished: false,
      ingredients: [
        {
          name: 'White rum',
          quantity: '50 ml',
        },
        {
          name: 'Lime',
          quantity: '1 pc',
        },
        {
          name: 'Mint',
          quantity: '8 leaves',
        },
        {
          name: 'Sugar',
          quantity: '2 tsp',
        },
        {
          name: 'Soda water',
          quantity: '100 ml',
        },
      ],
    }).save();

    console.log('Fixtures populated!');
  } finally {
    await mongoose.disconnect();
  }
};

run().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});

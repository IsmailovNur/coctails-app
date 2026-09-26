export const AppRoutes = {
  main: '/',
  register: "/register",
  login: "/login",

  cocktail: "/cocktails/:id",
  createCocktail: "/cocktails/new",
  myCocktails: "/cocktails/my",
  adminCocktails: "/admin/cocktails",

  notFound: '*',
} as const;
import { createBrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes.ts";
import { MainLayout } from "../pages/MainLayout/MainLayout.tsx";
import { NotFoundPage } from "../pages/NotFoundPage/NotFoundPage.tsx";
import { MainPage } from "../pages/MainPage/MainPage.tsx";
import { RegisterPage } from "../pages/RegisterPage/RegisterPage.tsx";
import { LoginPage } from "../pages/LoginPage/LoginPage.tsx";
import { RequireAdmin, RequireAuth } from "../shared/RoutesProtector.tsx";
import { CocktailPage } from "../pages/CocktailPage/CocktailPage.tsx";
import { MyCocktailsPage } from "../pages/MyCocktailsPage/MyCocktailsPage.tsx";
import CreateCocktailPage
  from "../pages/CreateCocktailPage/CreateCocktailPage.tsx";
import {
  AdminCocktailsPage
} from "../pages/AdminCocktailsPage/AdminCocktailsPage.tsx";

export const router =
  createBrowserRouter([
    {
      element: <MainLayout />,

      children: [
        {
          path: AppRoutes.main,
          element: <MainPage />,
        },

        {
          path: AppRoutes.cocktail,
          element: <CocktailPage />,
        },

        {
          path: AppRoutes.register,
          element: <RegisterPage />,
        },

        {
          path: AppRoutes.login,
          element: <LoginPage />,
        },

        {
          element: <RequireAuth />,
          children: [
            {
              path: AppRoutes.createCocktail,
              element: <CreateCocktailPage />,
            },

            {
              path: AppRoutes.myCocktails,
              element: <MyCocktailsPage />,
            },

            {
              element: <RequireAdmin />,
              children: [
                {
                  path: AppRoutes.adminCocktails,
                  element: <AdminCocktailsPage />,
                },
              ],
            },

          ],
        },

        {
          path: AppRoutes.notFound,
          element: <NotFoundPage />
        }
      ],
    },
  ]);

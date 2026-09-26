import React, { useState, type ChangeEvent } from "react";
import { useAppDispatch, } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import type { CocktailIngredient } from "../../entities/Cocktail/types";
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import { AppRoutes } from "../../routing/routes";
import { toast } from "react-toastify";
import { createCocktail } from "../../entities/Cocktail/cocktailThunk.ts";
import { Add, Delete } from "@mui/icons-material";

const CreateCocktailPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cocktail, setCocktail] =
    useState({
      name: "",
      recipe: "",
      ingredients: [{name: "", quantity: ""}] as CocktailIngredient[],
      image: null as File | null
    });

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setCocktail(
      (prevState) => ({...prevState, [name]: value})
    );
  };

  const ingredientChangeHandler = (
    index: number,
    field: | "name" | "quantity",
    value: string
  ) => {
    setCocktail(
      (prevState) => {
        const ingredients = [...prevState.ingredients];
        ingredients[index] = {...ingredients[index], [field]: value};

        return {...prevState, ingredients};
      }
    );
  };

  const addIngredient = () => {
    setCocktail(
      (prevState) => ({
        ...prevState, ingredients: [...prevState.ingredients,
          {name: "", quantity: ""}
        ]
      })
    );
  };

  const removeIngredient = (index: number) => {
    if (cocktail.ingredients.length === 1) {
      return;
    }

    setCocktail(
      (prevState) => ({
        ...prevState,
        ingredients: prevState.ingredients.filter(
          (_, ingredientIndex) => ingredientIndex !== index)
      })
    );
  };

  const submitHandler = async (
    e: React.SubmitEvent
  ) => {
    e.preventDefault();

    if (!cocktail.name.trim()) {
      toast.error("Cocktail name is required!");
      return;
    }

    if (!cocktail.recipe.trim()) {
      toast.error("Recipe is required!");
      return;
    }

    if (!cocktail.image) {
      toast.error(
        "Cocktail image is required!"
      );
      return;
    }

    const hasEmptyIngredient =
      cocktail.ingredients.some(
        (ingredient) =>
          !ingredient.name.trim() ||
          !ingredient.quantity.trim()
      );

    if (hasEmptyIngredient) {
      toast.error(
        "Fill all ingredient fields!"
      );
      return;
    }

    setLoading(true);

    try {
      await dispatch(
        createCocktail({
          name: cocktail.name.trim(),
          recipe: cocktail.recipe.trim(),
          ingredients: cocktail.ingredients.map((ingredient) => ({
              name: ingredient.name.trim(),
              quantity: ingredient.quantity.trim()
            })
          ),

          image: cocktail.image
        })
      ).unwrap();

      toast.success("Your cocktail is awaiting moderator approve!");
      navigate(AppRoutes.myCocktails);

    } catch (error) {
      toast.error("Failed to create cocktail!");

      console.log("CreateCocktailPage Error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{maxWidth: 600, mx: "auto", mt: 4, mb: 5}}>
      <Paper sx={{p: 4}} variant="outlined">
        <Typography variant="h5" sx={{mb: 4}}>
          Add new cocktail
        </Typography>

        <Box
          component="form"
          onSubmit={submitHandler}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3
          }}
        >
          <TextField
            label="Name"
            name="name"
            value={cocktail.name}
            onChange={inputChangeHandler}
          />

          <Box>
            <Typography variant="subtitle1" sx={{mb: 2}}>
              Ingredients
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2
              }}
            >
              {cocktail.ingredients.map(
                (
                  ingredient,
                  index
                ) => (
                  <Box
                    key={index}
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        {
                          xs: "1fr",
                          sm: "1fr 1fr auto"
                        },
                      gap: 2,
                      alignItems: "center"
                    }}
                  >
                    <TextField
                      label="Ingredient name"
                      value={ingredient.name}
                      onChange={(e) =>
                        ingredientChangeHandler(index, "name", e.target.value)}
                    />

                    <TextField
                      label="Quantity"
                      value={ingredient.quantity}
                      onChange={(e) =>
                        ingredientChangeHandler(index, "quantity", e.target.value)
                      }
                    />

                    <IconButton
                      onClick={() => removeIngredient(index)}
                      disabled={cocktail.ingredients.length === 1}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                )
              )}
            </Box>

            <Button
              startIcon={<Add />}
              sx={{mt: 2}}
              onClick={addIngredient}
            >
              Add ingredient
            </Button>
          </Box>

          <TextField
            label="Recipe"
            name="recipe"
            value={cocktail.recipe}
            onChange={inputChangeHandler}
            multiline
            rows={3}
          />

          <Button
            component="label"
            variant="outlined"
          >
            Select cocktail image

            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCocktail(
                  (prevState) => ({
                    ...prevState,
                    image: e.target.files?.[0] || null
                  })
                )
              }
            />
          </Button>

          {cocktail.image && (
            <Typography variant="body2">
              {cocktail.image.name}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            loading={loading}
          >
            Create cocktail
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
export default CreateCocktailPage
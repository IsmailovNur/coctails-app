import { useEffect, useState } from "react";
import { Spinner } from "../../shared/Spinner/Spinner";
import {
  Alert, Box, Button, Card, CardContent, CardMedia, List,
  ListItem, Typography
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import type { Cocktail } from "../../entities/Cocktail/types";
import axiosApi, { getApiErrorMessage, getImageUrl } from "../../shared/axios/AxiosApi";
import { AppRoutes } from "../../routing/routes";

export const CocktailPage = () => {
  const {id} = useParams();
  const [cocktail, setCocktail] = useState<Cocktail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCocktail = async () => {
      if (!id) {
        setError("Cocktail not found!");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosApi.get<Cocktail>(`/cocktails/${id}`);
        setCocktail(response.data);

      } catch (e) {
        setError(getApiErrorMessage(e));
      } finally {
        setLoading(false);
      }
    };

    void loadCocktail();
  }, [id]);

  if (loading) return <Spinner isLoading />;

  if (error || !cocktail) {
    return (
      <Box sx={{py: 4}}>
        <Alert severity="error" sx={{mb: 3}}>
          {error || "Cocktail not found!"}
        </Alert>

        <Button
          component={Link}
          to={AppRoutes.main}
          variant="contained"
        >
          Back to cocktails
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{maxWidth: 900, mx: "auto", py: 3}}>
      <Button
        component={Link}
        to={AppRoutes.main}
        sx={{mb: 2}}
      >
        ← Back
      </Button>

      <Card>
        <CardMedia
          component="img"
          image={getImageUrl(cocktail.image)}
          alt={cocktail.name}
          sx={{maxHeight: 500, objectFit: "cover"}}
        />

        <CardContent sx={{p: 4}}>
          <Typography variant="h3" sx={{mb: 3}}>
            {cocktail.name}
          </Typography>

          <Typography variant="h6" sx={{mb: 1}}>
            Ingredients
          </Typography>

          <List sx={{mb: 3}}>
            {cocktail.ingredients.map(
              (ingredient, index) => (
                <ListItem
                  key={`${ingredient.name}-${index}`}
                  disableGutters
                >
                  {ingredient.name} —{" "}
                  {ingredient.quantity}
                </ListItem>
              )
            )}
          </List>

          <Typography variant="h6" sx={{mb: 1}}>
            Recipe
          </Typography>

          <Typography
            sx={{whiteSpace: "pre-wrap"}}
          >
            {cocktail.recipe}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
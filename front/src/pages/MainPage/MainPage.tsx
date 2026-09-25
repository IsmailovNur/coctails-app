import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import {
  cocktailError,
  cocktails,
  isLoading
} from "../../entities/Cocktail/cocktailSlice.ts";
import { Alert, Box, Typography } from "@mui/material";
import {
  fetchPublishedCocktails
} from "../../entities/Cocktail/cocktailThunk.ts";
import { Spinner } from "../../shared/Spinner/Spinner.tsx";
import { CocktailCard } from "../../entities/Cocktail/CocktailCard.tsx";

export const MainPage = () => {
  const dispatch = useAppDispatch();
  const cocktailsData = useAppSelector(cocktails);
  const loading = useAppSelector(isLoading);
  const error = useAppSelector(cocktailError);

  useEffect(() => {
    void dispatch(fetchPublishedCocktails());
  }, [dispatch]);

  if (loading) {
    return <Spinner isLoading />;
  }

  return (
    <Box sx={{py: 2}}>
      <Typography variant="h4" sx={{mb: 4}}>
        Cocktails
      </Typography>

      {error && (
        <Alert severity="error" sx={{mb: 3}}>
          {error}
        </Alert>
      )}

      {!loading &&
        cocktailsData.length === 0 && (
          <Typography>
            No published cocktails yet.
          </Typography>
        )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)"
          },
          gap: 3
        }}
      >
        {cocktailsData.map(
          (cocktail) => (
            <CocktailCard
              key={cocktail._id}
              cocktail={cocktail}
              linkTo={`/cocktails/${cocktail._id}`}
            />
          )
        )}
      </Box>
    </Box>
  );
};
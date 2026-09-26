import { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector
} from "../../app/hooks.ts";
import {
  cocktailError,
  cocktails,
  isLoading
} from "../../entities/Cocktail/cocktailSlice.ts";
import {
  deleteCocktail,
  fetchMyCocktails
} from "../../entities/Cocktail/cocktailThunk.ts";
import { Alert, Box, Button, Typography } from "@mui/material";
import { Spinner } from "../../shared/Spinner/Spinner.tsx";
import { toast } from "react-toastify";
import { CocktailCard } from "../../entities/Cocktail/CocktailCard.tsx";

export const MyCocktailsPage = () => {
  const dispatch = useAppDispatch();
  const cocktailsData = useAppSelector(cocktails);
  const loading = useAppSelector(isLoading);
  const error = useAppSelector(cocktailError);

  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    void dispatch(fetchMyCocktails());
  }, [dispatch]);

  const deleteHandler = async (id: string) => {
    const confirmed = window.confirm("Delete this cocktail?");

    if (!confirmed) {
      return;
    }
    setDeleteLoading(id);

    try {
      await dispatch(deleteCocktail(id)).unwrap();
      toast.success("Cocktail deleted!");
      await dispatch(fetchMyCocktails()).unwrap();

    } catch (error) {
      toast.error("Failed to delete cocktail!");

      console.log("Delete cocktail error", error);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) return <Spinner isLoading />;

  return (
    <Box sx={{py: 2}}>
      <Typography
        variant="h4"
        sx={{mb: 4}}
      >
        My Cocktails
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{mb: 3}}
        >
          {error}
        </Alert>
      )}

      {!loading && cocktailsData.length === 0 && (
        <Typography>
          You have no one created cocktails!
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
              showStatus
              linkTo={cocktail.isPublished ? `/cocktails/${cocktail._id}` : undefined}
              actions={
                <Button
                  color="error"
                  variant="outlined"
                  loading={
                    deleteLoading === cocktail._id}
                  onClick={() => void deleteHandler(cocktail._id)}
                >
                  Delete
                </Button>
              }
            />
          )
        )}
      </Box>
    </Box>
  );
};
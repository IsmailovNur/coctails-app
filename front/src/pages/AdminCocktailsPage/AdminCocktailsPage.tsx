import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  cocktailError,
  cocktails,
  isLoading
} from "../../entities/Cocktail/cocktailSlice";
import { Alert, Box, Button, Typography } from "@mui/material";
import {
  deleteCocktail,
  fetchAdminCocktails,
  publishCocktail
} from "../../entities/Cocktail/cocktailThunk";
import { toast } from "react-toastify";
import { Spinner } from "../../shared/Spinner/Spinner.tsx";
import { CocktailCard } from "../../entities/Cocktail/CocktailCard.tsx";

export const AdminCocktailsPage = () => {
  const dispatch = useAppDispatch();
  const cocktailsData = useAppSelector(cocktails);
  const loading = useAppSelector(isLoading);
  const error = useAppSelector(cocktailError);

  const [
    actionLoading,
    setActionLoading
  ] = useState<string | null>(null);

  useEffect(() => {
    void dispatch(fetchAdminCocktails());
  }, [dispatch]);

  const publishHandler = async (id: string) => {
    setActionLoading(id);

    try {
      await dispatch(publishCocktail({id, isPublished: true})).unwrap();
      toast.success("Cocktail published!");
      await dispatch(fetchAdminCocktails()).unwrap();

    } catch (error) {
      toast.error("Failed to publish cocktail!");

      console.log("Publish cocktail error", error);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteHandler = async (id: string) => {
    const confirmed =
      window.confirm("Delete this cocktail?");

    if (!confirmed) {
      return;
    }

    setActionLoading(id);

    try {
      await dispatch(deleteCocktail(id)).unwrap();
      toast.success("Cocktail deleted!");
      await dispatch(fetchAdminCocktails()).unwrap();

    } catch (error) {
      toast.error("Failed to delete cocktail!");

      console.log("Delete cocktail error", error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Spinner isLoading />;


  return (
    <Box sx={{py: 2}}>
      <Typography variant="h4" sx={{mb: 4}}>
        Cocktail Moderation
      </Typography>

      {error && (
        <Alert severity="error" sx={{mb: 3}}>
          {error}
        </Alert>
      )}

      {!loading &&
        cocktailsData.length === 0 && (
          <Typography>
            No cocktails yet.
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
                <>
                  {!cocktail.isPublished && (
                    <Button
                      variant="contained"
                      loading={
                        actionLoading === cocktail._id}
                      onClick={() => void publishHandler(cocktail._id)}
                    >
                      Publish
                    </Button>
                  )}

                  <Button
                    color="error"
                    variant="outlined"
                    loading={actionLoading === cocktail._id}
                    onClick={() => void deleteHandler(cocktail._id)}
                  >
                    Delete
                  </Button>
                </>
              }
            />
          )
        )}
      </Box>
    </Box>
  );
};
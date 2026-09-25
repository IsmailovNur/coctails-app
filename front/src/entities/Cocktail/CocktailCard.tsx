import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  List,
  ListItem,
  Typography,
} from "@mui/material";

import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import type { Cocktail } from "./types.ts";
import { getImageUrl } from "../../shared/axios/AxiosApi.ts";

interface CocktailCardProps {
  cocktail: Cocktail;
  linkTo?: string;
  showStatus?: boolean;
  actions?: ReactNode;
}

export const CocktailCard = (props: CocktailCardProps) => {

  const {
    cocktail,
    linkTo,
    showStatus = false,
    actions,
  } = props

  const title = linkTo ? (
    <Typography
      component={Link}
      to={linkTo}
      variant="h5"
      sx={{
        textDecoration: "none",
        color: "inherit",
        fontWeight: "bold"
      }}
    >
      {cocktail.name}
    </Typography>
  ) : (
    <Typography
      variant="h5"
      sx={{fontWeight: "bold"}}
    >
      {cocktail.name}
    </Typography>
  );

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <CardMedia
        component="img"
        height="220"
        image={getImageUrl(cocktail.image)}
        alt={cocktail.name}
        sx={{objectFit: "cover"}}
      />

      <CardContent sx={{flexGrow: 1}}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            mb: 2
          }}
        >
          {title}

          {showStatus && (
            <Chip
              size="small"
              label={cocktail.isPublished ? "Published" : "Pending"}
              color={cocktail.isPublished ? "success" : "warning"}
            />
          )}
        </Box>

        <Typography
          variant="subtitle1"
          sx={{fontWeight: "bold", mb: 1}}
        >
          Ingredients
        </Typography>

        <List
          dense
          disablePadding
          sx={{mb: 2}}
        >
          {cocktail.ingredients.map(
            (ingredient, index) => (
              <ListItem
                key={`${ingredient.name}-${index}`}
                disableGutters
              >
                <Typography
                  variant="body2"
                >
                  {ingredient.name} —{" "}
                  {ingredient.quantity}
                </Typography>
              </ListItem>
            )
          )}
        </List>

        <Typography
          variant="subtitle1"
          sx={{fontWeight: "bold", mb: 1}}
        >
          Recipe
        </Typography>

        <Typography
          variant="body2"
          sx={{whiteSpace: "pre-wrap"}}
        >
          {cocktail.recipe}
        </Typography>
      </CardContent>

      {actions && (
        <CardActions>
          {actions}
        </CardActions>
      )}
    </Card>
  );
};
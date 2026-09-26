import {
  useNavigate,
  Link as RouterLink
} from "react-router-dom";

import {
  useAppDispatch,
  useAppSelector
} from "../../app/hooks.ts";

import {
  AppRoutes
} from "../../routing/routes.ts";

import {
  Box,
  Container,
  Toolbar,
  Typography,
  Avatar,
  Divider,
  Button
} from "@mui/material";

import {
  selectUser,
  unsetUser
} from "../../entities/User/userSlice.ts";

import {
  logoutUser
} from "../../entities/User/userThunk.ts";

import {
  getImageUrl
} from "../../shared/axios/AxiosApi.ts";

const AppHeader = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const logoutHandler = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (e) {
      console.log("Logout error", e);
    } finally {
      dispatch(unsetUser());
      navigate(AppRoutes.main);
    }
  };

  const displayName = user?.displayName || user?.username || "User";
  const avatarSrc = user?.avatar ? getImageUrl(user.avatar) : undefined;

  return (
    <Box
      component="header"
      sx={{
        mb: 2,
        borderBottom: "1px solid",
        borderColor: "divider"
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            py: 1
          }}
        >
          <Typography
            variant="h4"
            component={RouterLink}
            to={AppRoutes.main}
            sx={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: "bold"
            }}
          >
            Cocktails
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "flex-end"
            }}
          >
            {user ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  <Avatar
                    sx={{border: '1px solid #ccc'}}
                    src={avatarSrc}
                    alt={displayName}
                  >
                    {displayName
                      .charAt(0)
                      .toUpperCase()}
                  </Avatar>

                  <Typography>
                    {displayName}
                  </Typography>
                </Box>

                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{mx: 1}}
                />

                <Button
                  component={RouterLink}
                  to={AppRoutes.createCocktail}
                  color="inherit"
                >
                  Add Cocktail
                </Button>

                <Button
                  component={RouterLink}
                  to={AppRoutes.myCocktails}
                  color="inherit"
                >
                  My Cocktails
                </Button>

                {user.role === "admin" && (
                  <Button
                    component={RouterLink}
                    to={AppRoutes.adminCocktails}
                    color="inherit"
                  >
                    Moderation
                  </Button>
                )}

                <Button
                  color="inherit"
                  onClick={logoutHandler}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to={AppRoutes.login}
                  color="inherit"
                >
                  Sign In
                </Button>

                <Button
                  component={RouterLink}
                  to={AppRoutes.register}
                  color="inherit"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </Box>
  );
};

export default AppHeader;
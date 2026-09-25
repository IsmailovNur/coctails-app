import { Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';
import { AppRoutes } from "../../routing/routes.ts";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { selectUser, unsetUser } from "../../entities/User/userSlice.ts";
import { logoutUser } from "../../entities/User/userThunk.ts";

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

  // const displayName = user?.displayName || user?.username || "User";
  // const avatarSrc = user?.avatar ? getImageUrl(user.avatar) : undefined;

  return (
    <Box component="header" sx={{mb: 2, borderBottom: '1px solid #fff'}}>
      <Container maxWidth='lg'>
        <Toolbar disableGutters sx={{
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}>
          <Typography
            variant="h4"
            component={Link}
            to={AppRoutes.main}
            sx={{textDecoration: 'none', color: 'inherit', fontWeight: 'bold'}}
          >
            Cocktails
          </Typography>

          <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
            {user ? (
              <>
                <Typography variant="body1">Hello, {user.username}!</Typography>
                <Button color="inherit" onClick={logoutHandler}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} to={AppRoutes.login} color="inherit">
                  Sign In
                </Button>
                <Button component={Link} to={AppRoutes.register} color="inherit">
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
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Link
} from "@mui/material";
import {
  useAppDispatch,
  useAppSelector
} from "../../app/hooks";
import { useState, type ChangeEvent } from "react";
import {
  selectLoginError,
  selectLoginLoading
} from "../../entities/User/userSlice";
import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { loginUser } from "../../entities/User/userThunk";
import { AppRoutes } from "../../routing/routes";
import { toast } from "react-toastify";

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loginLoading = useAppSelector(selectLoginLoading);
  const loginError = useAppSelector(selectLoginError);

  const [state, setState] = useState({
    username: '',
    password: '',
  });

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setState((prevState) => ({...prevState, [name]: value}));
  };

  const submitHandler = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!state.username.trim()) {
      toast.error("Username is required!");
      return;
    }

    if (!state.password.trim()) {
      toast.error("Password is required!");
      return;
    }

    try {
      await dispatch(
        loginUser({
          username: state.username.trim(),
          password: state.password,
        })).unwrap();

      toast.success("Login successful!");
      navigate(AppRoutes.main);

    } catch (error) {
      console.log("LoginPage Error", error);
    }
  };

  return (
    <Box sx={{maxWidth: 500, mx: "auto", mt: 4}}>
      <Paper sx={{p: 4}} variant="outlined">
        <Typography variant="h5" align="center" sx={{mb: 4}}>
          Sign In
        </Typography>

        {loginError && (
          <Alert severity="error" sx={{mb: 2}}>
            {loginError.error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={submitHandler}
          sx={{display: "flex", flexDirection: "column", gap: 3}}
        >
          <TextField
            label="Username"
            name="username"
            value={state.username}
            onChange={inputChangeHandler}
          />

          <TextField
            type="password"
            label="Password"
            name="password"
            value={state.password}
            onChange={inputChangeHandler}
          />

          <Button
            type="submit"
            variant="contained"
            loading={loginLoading}
            disabled={!state.username.trim() || !state.password.trim()}
          >
            Sign In
          </Button>

          <Typography
            variant="body2"
            sx={{textAlign: "center"}}
          >
            Don't have an account?{" "}
            <Link
              component={RouterLink}
              to={AppRoutes.register}
              underline="hover"
            >
              Register now
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
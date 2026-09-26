import {
  useAppDispatch,
  useAppSelector
} from "../../app/hooks";
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Link,
  Typography
} from "@mui/material";
import React, { useState, type ChangeEvent } from "react";
import { AppRoutes } from "../../routing/routes";
import { registerUser } from "../../entities/User/userThunk";
import { toast } from "react-toastify";
import {
  Link as RouterLink,
  useNavigate
} from "react-router-dom";
import {
  selectRegisterError,
  selectRegisterLoading
} from "../../entities/User/userSlice.ts";

export const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const registerLoading = useAppSelector(selectRegisterLoading);
  const registerError = useAppSelector(selectRegisterError);

  const [state, setState] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
    avatar: null as File | null
  });

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setState((prevState) => ({...prevState, [name]: value,}));
  };

  const submitHandler = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!state.username.trim()) {
      toast.error("Username is required!");
      return;
    }

    if (!state.displayName.trim()) {
      toast.error("Display name is required!");
      return;
    }

    if (!state.email.trim()) {
      toast.error("Email is required!");
      return;
    }

    if (!state.password.trim()) {
      toast.error("Password is required!");
      return;
    }

    if (!state.avatar) {
      toast.error("Avatar is required!");
      return;
    }

    try {
      const avatar =state.avatar;

      await dispatch(
        registerUser({
          username: state.username.trim(),
          displayName: state.displayName.trim(),
          email: state.email.trim(),
          password: state.password,
          avatar,
        })
      ).unwrap();

      toast.success("Registration successful!");
      navigate(AppRoutes.main);

    } catch (error) {
      console.log("RegisterPage Error", error);
    }
  };

  return (
    <Box
      sx={{maxWidth: 500, mx: "auto", mt: 4}}
    >
      <Paper sx={{p: 4}} variant="outlined">
        <Typography variant="h5" align="center" sx={{mb: 4}}>
          Sign Up
        </Typography>

        {registerError && (
          <Alert severity="error" sx={{mb: 2}}>
            {registerError.error}
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
            label="Display Name"
            name="displayName"
            value={state.displayName}
            onChange={inputChangeHandler}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={state.email}
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
            component="label"
            variant="outlined"
          >
            Select avatar

            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) =>
                setState(
                  (prevState) => ({
                    ...prevState,
                    avatar: e.target.files?.[0] || null,
                  })
                )
              }
            />
          </Button>

          {state.avatar && (
            <Typography variant="body2">
              {state.avatar.name}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            loading={registerLoading}
            disabled={
              !state.username.trim() ||
              !state.displayName.trim() ||
              !state.email.trim() ||
              !state.password.trim() ||
              !state.avatar
            }
          >
            Sign Up
          </Button>

          <Typography
            variant="body2"
            sx={{textAlign: "center"}}
          >
            Already have an account?{" "}

            <Link
              component={RouterLink}
              to={AppRoutes.login}
              underline="hover"
            >
              Login now
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
export default RegisterPage
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Avatar,
  Box,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { Copyright } from '../MuiComponents/Copyright';
import { createUserAPI } from './api-endpoints';

const theme = createTheme();

export const SignUp = (props) => {
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [firebaseError, setFirebaseError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateInput(e);
  };

  const validateInput = (e) => {
    let { name, value } = e.target;
    setValidationErrors((prev) => {
      const stateObj = { ...prev, [name]: '' };

      switch (name) {
        case 'firstName':
          if (!value) {
            stateObj[name] = 'Please enter first name.';
          }
          break;

        case 'lastName':
          if (!value) {
            stateObj[name] = 'Please enter last name.';
          }
          break;

        case 'email':
          if (!value) {
            stateObj[name] = 'Please enter email address.';
          }

          break;

        case 'password':
          if (!value) {
            stateObj[name] = 'Please enter Password.';
          } else if (
            userInput.confirmPassword &&
            value !== userInput.confirmPassword
          ) {
            stateObj['confirmPassword'] =
              'Password and Confirm Password does not match.';
          } else {
            stateObj['confirmPassword'] = userInput.confirmPassword
              ? ''
              : validationErrors.confirmPassword;
          }
          break;

        case 'confirmPassword':
          if (!value) {
            stateObj[name] = 'Please enter Confirm Password.';
          } else if (userInput.password && value !== userInput.password) {
            stateObj[name] = 'Password and Confirm Password does not match.';
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };

  const createUser = useMutation(createUserAPI, {
    onSuccess: (data) => {
      console.log(data);
      setLoading(false);
      setRedirect(true);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const fbData = userCredential.user;
        const profileDetails = {
          firstName: data.get('firstName'),
          lastName: data.get('lastName'),
          email: fbData.email,
          isEmailVerified: fbData.emailVerified,
          metadata: fbData.metadata,
        };
        const body = {
          userId: fbData.uid,
          profileDetails,
          roles: props.roles,
        };
        createUser.mutate(body);
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use')
          setFirebaseError('Email already exist');
        if (error.code === 'auth/invalid-email')
          setFirebaseError('Please enter valid email address');
        setLoading(false);
        // const errorCode = error.code;
        // const errorMessage = error.message;
        console.log(error.code);
      });
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          {firebaseError && <Alert severity="error">{firebaseError}</Alert>}
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  onChange={onInputChange}
                  onBlur={validateInput}
                />
                {validationErrors.firstName && (
                  <small style={{ color: 'red' }}>
                    {validationErrors.firstName}
                  </small>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={onInputChange}
                  onBlur={validateInput}
                />
                {validationErrors.lastName && (
                  <small style={{ color: 'red' }}>
                    {validationErrors.lastName}
                  </small>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={onInputChange}
                  onBlur={validateInput}
                />
                {validationErrors.email && (
                  <small style={{ color: 'red' }}>
                    {validationErrors.email}
                  </small>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={onInputChange}
                  onBlur={validateInput}
                />
                {validationErrors.password && (
                  <small style={{ color: 'red' }}>
                    {validationErrors.password}
                  </small>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  onChange={onInputChange}
                  onBlur={validateInput}
                />
                {validationErrors.confirmPassword && (
                  <small style={{ color: 'red' }}>
                    {validationErrors.confirmPassword}
                  </small>
                )}
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>

            <LoadingButton
              loading={loading}
              type="submit"
              disabled={
                validationErrors.firstName ||
                validationErrors.lastName ||
                validationErrors.email !== '' ||
                validationErrors.password !== '' ||
                validationErrors.confirmPassword !== ''
              }
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                <Link href="/signIn" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
              <Grid item>
                {props.roles.includes('doctor') ? null : (
                  <Link href="/doctorSignUp" variant="body2">
                    {'Are you a doctor? Register here'}
                  </Link>
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
};

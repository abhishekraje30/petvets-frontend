import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
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
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';
import { auth } from '../firebaseConfig';
import { Copyright } from '../MuiComponents/Copyright';

const theme = createTheme();

export const SignIn = () => {
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    email: '',
    password: '',
  });
  const [firebaseError, setFirebaseError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
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
        case 'email':
          if (!value) {
            stateObj[name] = 'Please enter your registered email address.';
          }

          break;

        case 'password':
          if (!value) {
            stateObj[name] = 'Please enter your sign in password.';
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };

  const dummyLogin = async (role) => {
    if (role === 'admin') {
      try {
        setLoading(true);
        await signInWithEmailAndPassword(
          auth,
          'fgoscar6q@ft.com',
          'Jm3JylHy82'
        );
        setLoading(false);
        setRedirect(true);
      } catch (error) {
        const errorCode = error.code;
        if (error.code === 'auth/wrong-password')
          setFirebaseError('Please enter correct password');
        if (error.code === 'auth/user-not-found')
          setFirebaseError('User is not registered');
        console.log(errorCode);
        setLoading(false);
      }
    } else if (role === 'doctor') {
      try {
        setLoading(true);
        await signInWithEmailAndPassword(
          auth,
          'hwoodham97@com.com',
          'l6tY1oRl8q'
        );
        setLoading(false);
        setRedirect(true);
      } catch (error) {
        const errorCode = error.code;
        if (error.code === 'auth/wrong-password')
          setFirebaseError('Please enter correct password');
        if (error.code === 'auth/user-not-found')
          setFirebaseError('User is not registered');
        console.log(errorCode);
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        await signInWithEmailAndPassword(
          auth,
          'cleancd@oaic.gov.au',
          'qSSG1FA9R'
        );
        setLoading(false);
        setRedirect(true);
      } catch (error) {
        const errorCode = error.code;
        if (error.code === 'auth/wrong-password')
          setFirebaseError('Please enter correct password');
        if (error.code === 'auth/user-not-found')
          setFirebaseError('User is not registered');
        console.log(errorCode);
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      setRedirect(true);
    } catch (error) {
      const errorCode = error.code;
      if (error.code === 'auth/wrong-password')
        setFirebaseError('Please enter correct password');
      if (error.code === 'auth/user-not-found')
        setFirebaseError('User is not registered');
      console.log(errorCode);
      setLoading(false);
    }
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
          <img src={Logo} alt="logo" style={{ height: '100px' }} />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {firebaseError && <Alert severity="error">{firebaseError}</Alert>}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={onInputChange}
              onBlur={validateInput}
              helperText={
                validationErrors.email && (
                  <small style={{ color: 'red', fontSize: 'small' }}>
                    {validationErrors.email}
                  </small>
                )
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={onInputChange}
              onBlur={validateInput}
              helperText={
                validationErrors.password && (
                  <small style={{ color: 'red', fontSize: 'small' }}>
                    {validationErrors.password}
                  </small>
                )
              }
            />

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <LoadingButton
              loading={loading}
              type="submit"
              disabled={
                validationErrors.email !== '' ||
                validationErrors.password !== '' ||
                userInput.email === '' ||
                userInput.password === ''
              }
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                <Link href="/forgotPassword" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/userSignUp" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
          <br />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              gap: 2,
              justifyContent: 'space-between',
            }}
          >
            <Button
              onClick={() => dummyLogin('user')}
              variant="contained"
              color="primary"
            >
              User
            </Button>
            <Button
              onClick={() => dummyLogin('doctor')}
              variant="contained"
              color="primary"
            >
              Doctor
            </Button>
            <Button
              onClick={() => dummyLogin('admin')}
              variant="contained"
              color="primary"
            >
              Admin
            </Button>
          </div>
        </Box>

        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

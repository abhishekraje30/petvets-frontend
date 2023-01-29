import { createTheme, ThemeProvider } from '@mui/material/styles';
import { onAuthStateChanged } from 'firebase/auth';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AdminDoctor from './components/AdminDoctor';
import AllDoctors from './components/AllDoctors';
import { AppointmentHistory } from './components/AppointmentHistory';
import Blog from './components/Blog';
import BlogDetail from './components/BlogDetail';
import { FindDoctor } from './components/FindDoctor';
import { ForgotPassword } from './components/ForgotPassword';
import { Home } from './components/Home';
import { ShowDoctor } from './components/ShowDoctor';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { UserProfile } from './components/UserProfile';
import { auth } from './firebaseConfig';
import './index.css';
import { ProtectedRoute } from './ProtectedRoute';
import { fetchUser } from './reducers/auth.reducer';
import { store } from './store';

export const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    primary: {
      main: '#60a5dd',
      contrastText: 'white',
    },
  },
});

const router = createBrowserRouter([
  { path: '/userSignUp', element: <SignUp role="user" /> },
  { path: '/doctorSignUp', element: <SignUp role="doctor" /> },
  { path: '/signIn', element: <SignIn /> },
  { path: '/forgotPassword', element: <ForgotPassword /> },

  {
    path: '/',
    element: (
      <ThemeProvider theme={theme}>
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      </ThemeProvider>
    ),
    children: [
      { path: '/allDoctors', element: <AllDoctors /> },
      {
        path: '/allDoctors/:doctorId',
        element: <AdminDoctor />,
      },
      {
        path: '/findDoctor/:id',
        element: (
          <ThemeProvider theme={theme}>
            <ProtectedRoute>
              <ShowDoctor />
            </ProtectedRoute>
          </ThemeProvider>
        ),
      },
      {
        path: '/blog',
        element: (
          <ProtectedRoute>
            <Blog />
          </ProtectedRoute>
        ),
      },
      {
        path: '/blogDetail',
        element: (
          <ProtectedRoute>
            <BlogDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: '/findDoctor',
        element: (
          <ProtectedRoute>
            <FindDoctor />
          </ProtectedRoute>
        ),
      },
      {
        path: '/myAppointments',
        element: (
          <ProtectedRoute>
            <AppointmentHistory />
          </ProtectedRoute>
        ),
      },

      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <UserProfile uid="" />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

onAuthStateChanged(auth, (user) => {
  store.dispatch(fetchUser(user));
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </QueryClientProvider>
    </React.StrictMode>
  );
});

import { onAuthStateChanged } from 'firebase/auth';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { App } from './App';
import AdminDoctor from './components/AdminDoctor';
import AllDoctors from './components/AllDoctors';
import { AppointmentHistory } from './components/AppointmentHistory';
import { FindDoctor } from './components/FindDoctor';
import { ForgotPassword } from './components/ForgotPassword';
import { ShowDoctor } from './components/ShowDoctor';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { UserProfile } from './components/UserProfile';
import { auth } from './firebaseConfig';
import './index.css';
import { ProtectedRoute } from './ProtectedRoute';
import { signin, signout } from './reducers/auth.reducer';
import { store } from './store';

export const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: '/userSignUp', element: <SignUp role="user" /> },
  { path: '/doctorSignUp', element: <SignUp role="doctor" /> },
  { path: '/signIn', element: <SignIn /> },
  { path: '/forgotPassword', element: <ForgotPassword /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { path: '/allDoctors', element: <AllDoctors /> },
      {
        path: '/findDoctor/:id',
        element: (
          <ProtectedRoute>
            <ShowDoctor />
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
            <UserProfile />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/allDoctors/:userId',
    element: <AdminDoctor />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

onAuthStateChanged(auth, (user) => {
  if (user !== null) {
    store.dispatch(signin(user.uid));
  } else {
    store.dispatch(signout());
  }
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

import { onAuthStateChanged } from 'firebase/auth';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { App } from './App';
import { ForgotPassword } from './Auth/ForgotPassword';
import { SignIn } from './Auth/SignIn';
import { SignUp } from './Auth/SignUp';
import { auth } from './firebaseConfig';
import './index.css';
import { UserProfile } from './MuiComponents/UserProfile';
import { ProtectedRoute } from './ProtectedRoute';
import { signin, signout } from './reducers/auth.reducer';
import { store } from './store';

export const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: '/userSignUp', element: <SignUp roles={['user']} /> },
  { path: '/doctorSignUp', element: <SignUp roles={['doctor', 'user']} /> },
  { path: '/signIn', element: <SignIn /> },
  { path: '/forgotPassword', element: <ForgotPassword /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: '/userProfile',
    element: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    ),
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

onAuthStateChanged(auth, (user) => {
  if (user !== null) {
    store.dispatch(signin());
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

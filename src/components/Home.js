import { Box, Container } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';

import { Outlet, useLocation } from 'react-router-dom';
import AllDoctors from './AllDoctors';
import { AppointmentHistory } from './AppointmentHistory';
import { HomeContent } from './homeContent';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const Home = () => {
  const { userData } = useSelector((state) => state.authStatus);
  const location = useLocation();
  const { role } = userData;
  if (role === 'user') {
    return (
      <>
        <Navbar />
        <Sidebar />
        <Container>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {location.pathname === '/' ? <HomeContent /> : <Outlet />}
          </Box>
        </Container>
      </>
    );
  }
  if (role === 'doctor') {
    return (
      <>
        <Navbar />
        <Sidebar />
        <Container>
          <Box
            sx={{
              marginTop: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {location.pathname === '/' ? <AppointmentHistory /> : <Outlet />}
          </Box>
        </Container>
      </>
    );
  }
  if (role === 'admin') {
    return (
      <>
        <Navbar />
        <Sidebar />
        <Container>
          <Box
            sx={{
              marginTop: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {location.pathname === '/' ? <AllDoctors /> : <Outlet />}
          </Box>
        </Container>
      </>
    );
  }
};

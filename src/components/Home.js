import { Box, Container } from '@mui/material';
import React from 'react';

import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const Home = () => (
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
        <Outlet />
      </Box>
    </Container>
  </>
);

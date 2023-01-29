import React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export const Copyright = (props) => (
  <Typography
    variant="body2"
    color="text.secondary"
    align="center"
    {...props}
    style={{ background: '#60a5dd', color: 'white', width: '100%' }}
  >
    {'Copyright © '}
    <Link color="inherit" href="/">
      PetVet
    </Link>{' '}
    {new Date().getFullYear()}
  </Typography>
);

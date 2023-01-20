import AdbIcon from '@mui/icons-material/Adb';

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { signOut } from 'firebase/auth';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';
import { auth } from '../firebaseConfig';
import { signout } from '../reducers/auth.reducer';
import Logo from '../assets/images/Logo.png';

export const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [image, setImage] = useState({ preview: '', raw: '' });
  const { userId, userData } = useSelector((state) => state.authStatus);
  const storage = getStorage();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const profilePath = userData.profileURL;
        const storageRef = ref(storage, profilePath);
        const url = await getDownloadURL(storageRef);
        // setImage({ ...image, preview: url });
      } catch (error) {
        if (error.code === 'storage/invalid-url') {
          const profilePath = userData.profileURL;
          setImage({ ...image, preview: profilePath });
        } else {
          setImage({ ...image, preview: '/Avatar.jpg' });
        }
      }
    };
    fetchAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.profileURL]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(signout);
      navigate('/signIn');
      console.log('Sign out successfull');
    } catch (error) {
      console.log('Sign out error' + error);
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Link className="link white" to={'/'}>
            <img src={Logo} alt="logo" style={{ height: '55px' }} />
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              <Link className="link white" to={'findDoctor'}>
                Find Doctor
              </Link>
            </Button>
            <Button
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              <Link className="link white" to={'blog'}>
                Blog
              </Link>
            </Button>

            {userData?.role === 'admin' ? (
              <Button
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                <Link className="link white" to={'/allDoctors'}>
                  All Doctors
                </Link>
              </Button>
            ) : null}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  sx={{ backgroundColor: '#DD6E0F' }}
                  alt="Remy Sharp"
                  src={image.preview}
                >
                  AB
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleCloseUserMenu}>
                <Link to={'/profile'} className="link black">
                  <Typography textAlign="center">Profile</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <Link to={'/myAppointments'} className="link black">
                  <Typography textAlign="center">My Appointment</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Account</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Dashboard</Typography>
              </MenuItem>
              <MenuItem onClick={handleSignOut}>
                <Typography className="black" textAlign="center">
                  SignOut
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

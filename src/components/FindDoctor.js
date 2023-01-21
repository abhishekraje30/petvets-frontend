import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api-client';

import { cities } from '../utils/cities.js';
import {
  Typography,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Autocomplete,
  Grid,
  Skeleton,
  Box,
} from '@mui/material';

import '../css/findDoctor.css';

export const FindDoctor = () => {
  const [doctor, setDoctor] = React.useState([]);
  const [searchedDoctor, setSearchedDoctor] = React.useState(null);
  const [searchedCity, setSearchedCity] = React.useState(null);
  const navigate = useNavigate();

  const queryParameters = new URLSearchParams(window.location.search);
  const category = queryParameters.get('category');

  const flatProps = {
    options: cities,
    getOptionLabel: (option) => option.name,
  };

  const doctorList = {
    options: doctor,
    getOptionLabel: (option) => option.firstName,
  };

  const findDoctor = async () => {
    let doctors = {};
    if (searchedDoctor && searchedCity) {
      doctors = await axiosClient.get(
        `es/results?doctor=${searchedDoctor.firstName}&city=${searchedCity.name}`
      );
    } else if (searchedDoctor && !searchedCity) {
      doctors = await axiosClient.get(
        'es/results?doctor=' + searchedDoctor.firstName
      );
    } else if (searchedCity && !searchedDoctor) {
      doctors = await axiosClient.get('es/results?city=' + searchedCity.name);
    } else {
      doctors = await axiosClient.get('api/users?role=doctor');
    }
    setDoctor(doctors.data);
  };

  // React.useEffect(() => {
  //   const getDoctor = async () => {
  //     const doctors = await axiosClient.get('api/users?role=doctor');
  //     setDoctor(doctors.data);
  //   };
  //   getDoctor();
  // }, []);

  React.useEffect(() => {
    const getDoctor = async () => {
      let doctors = [];
      if (category) {
        doctors = await axiosClient.get(`es/results?category=${category}`);
      } else {
        doctors = await axiosClient.get('api/users?role=doctor');
      }
      setDoctor(doctors.data);
    };
    getDoctor();
  }, [category]);

  const showDoctor = (id) => {
    navigate('/findDoctor/' + id);
  };

  const SkeletonLoading = () => (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4">
        <Skeleton width="30%" />
      </Typography>
      <Grid container wrap="nowrap">
        {Array.from(new Array(3)).map((item, index) => (
          <Box key={index} sx={{ width: 210, marginRight: 1, my: 2 }}>
            <Skeleton variant="rectangular" width={210} height={118} />
            <Box sx={{ pt: 0.5 }}>
              <Skeleton />
              <Skeleton width="60%" />
            </Box>
          </Box>
        ))}
      </Grid>
    </Box>
  );

  return (
    <>
      <Card sx={{ display: 'flex' }} className="card-pos">
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Grid container spacing={0}>
            <Grid item xs={6}>
              <Autocomplete
                {...doctorList}
                id="auto-complete"
                autoComplete
                includeInputInList
                value={searchedDoctor}
                onChange={(event, newValue) => {
                  setSearchedDoctor(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" label="Doctor" />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                {...flatProps}
                id="auto-complete"
                autoComplete
                includeInputInList
                value={searchedCity}
                onChange={(event, newValue) => {
                  setSearchedCity(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" label="City" />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                size="small"
                variant="contained"
                className="search-btn"
                onClick={findDoctor}
              >
                Find Now
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {!doctor && (
        <Box>
          <SkeletonLoading />
        </Box>
      )}
      <Grid container spacing={2} style={{ marginTop: '10px' }}>
        {doctor.length &&
          doctor.map((doc) => (
            <Grid item xs={4} key={doc.userId}>
              <Card sx={{ maxWidth: 345 }} key="doc._id" className="card">
                <CardMedia
                  sx={{ height: 140 }}
                  image={doc.profileURL}
                  title={doc.firstName}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {doc.firstName} {doc.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {doc.yearsOfExperience} years of experience
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {doc.services}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => showDoctor(doc.userId)}
                  >
                    Book Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        {!doctor.length && (searchedDoctor || searchedCity || category) && (
          <Typography variant="h4" component="h4">
            <span className="no-doctor">No Doctor found</span>
          </Typography>
        )}
      </Grid>
    </>
  );
};

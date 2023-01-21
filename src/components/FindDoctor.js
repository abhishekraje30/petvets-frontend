import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api-client';
import { SearchBar } from './SearchBar';

import {
  Typography,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Skeleton,
  Box,
} from '@mui/material';

import '../css/findDoctor.css';

export const FindDoctor = () => {
  const [doctor, setDoctor] = React.useState([]);
  const navigate = useNavigate();

  const queryParameters = new URLSearchParams(window.location.search);
  const category = queryParameters.get('category');
  const doctorParam = queryParameters.get('doctor');
  const cityParam = queryParameters.get('city');

  const findDoctor = async (searchedDoctor, searchedCity) => {
    let doctors = {};
    if (searchedDoctor && searchedCity) {
      doctors = await axiosClient.get(
        `es/results?doctor=${searchedDoctor}&city=${searchedCity.name}`
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

  React.useEffect(() => {
    const getDoctor = async () => {
      let doctors = [];
      if (category) {
        doctors = await axiosClient.get(`es/results?category=${category}`);
      } else if (doctorParam && !cityParam) {
        doctors = await axiosClient.get(`es/results?doctor=${doctorParam}`);
      } else if (cityParam && !doctorParam) {
        doctors = await axiosClient.get(`es/results?city=${cityParam}`);
      } else if (cityParam && doctorParam) {
        doctors = await axiosClient.get(
          `es/results?city=${cityParam}&doctor=${doctorParam}`
        );
      } else {
        doctors = await axiosClient.get('api/users?role=doctor');
      }
      setDoctor(doctors.data);
    };
    getDoctor();
  }, [category, cityParam, doctorParam]);

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
        <SearchBar
          findDoctor={findDoctor}
          doctorParam={doctorParam}
          cityParam={cityParam}
        />
      </Card>
      {!doctor && (
        <Box>
          <SkeletonLoading />
        </Box>
      )}
      <Grid container spacing={2} style={{ marginTop: '10px' }}>
        {doctor.length ? (
          doctor.map((doc) => (
            <Grid item xs={4} key={doc.userId}>
              <Card sx={{ maxWidth: 345 }} key="doc._id" className="card">
                <CardMedia
                  sx={{ height: 200, objectFit: 'contain' }}
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
          ))
        ) : (
          <Typography variant="h4" component="h4">
            <span className="no-doctor">No Doctor found</span>
          </Typography>
        )}
      </Grid>
    </>
  );
};

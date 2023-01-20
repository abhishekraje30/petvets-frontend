import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api-client';

import { cities } from '../utils/cities';
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
} from '@mui/material';

import '../css/findDoctor.css';
// import notFoundImage from '../assets/images/notFound.jpeg';

export const FindDoctor = () => {
  const [doctor, setDoctor] = React.useState([]);
  const [city, setCity] = React.useState([]);
  const [searchedDoctor, setSearchedDoctor] = React.useState([]);
  const [searchedCity, setSearchedCity] = React.useState([]);
  const navigate = useNavigate();

  const searchDoctor = async (e) => {
    if (e.code === 'Enter' && e.target.value !== '') {
      const doctors = await axiosClient.get(
        'es/results?doctor=' + e.target.value
      );
      setDoctor(doctors.data);
    }
  };

  const SearchCity = async (e) => {
    if (e.code === 'Enter' && e.target.value !== '') {
      const city = cities.filter((x) =>
        x.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setCity(city);
    }
  };

  const findDoctor = async () => {
    let doctors = {};
    if (searchedDoctor && searchedDoctor) {
      doctors = await axiosClient.get(
        `es/results?doctor=${searchedDoctor}&city=${searchedCity}`
      );
    }
    if (searchedDoctor && !searchedCity) {
      doctors = await axiosClient.get('es/results?doctor=' + searchedDoctor);
    }
    if (searchedCity && !searchedDoctor) {
      doctors = await axiosClient.get('es/results?city=' + searchedCity);
    }
    setDoctor(doctors.data);
  };

  React.useEffect(() => {
    const getDoctor = async () => {
      const doctors = await axiosClient.get('api/users?role=doctor');
      setDoctor(doctors.data);
    };
    getDoctor();
  }, []);

  const showDoctor = (id) => {
    navigate('/findDoctor/' + id);
  };

  return (
    <>
      <Card sx={{ display: 'flex' }} className="card-pos">
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Grid container spacing={0}>
            <Grid item xs={6}>
              <Autocomplete
                className="input-field"
                freeSolo
                autoComplete
                autoHighlight
                options={
                  doctor.length ? doctor.map((doc) => doc.firstName) : []
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Find Doctor"
                    value={searchedDoctor}
                    onChange={() => setSearchedDoctor(searchDoctor)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                className="input-field"
                freeSolo
                autoComplete
                autoHighlight
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="City"
                    value={searchedCity}
                    onChange={() => setSearchedCity(searchedCity)}
                  />
                )}
                options={city.map((c) => c)}
                onKeyDown={(e) => SearchCity(e)}
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
        {doctor.length == 0 && (doctor || city) && (
          <Typography variant="h4" component="h4">
            <span className="no-doctor">No Doctor found</span>
          </Typography>
        )}
      </Grid>
    </>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api-client';
import { SearchBar } from './SearchBar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
  Typography,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Pagination,
} from '@mui/material';

import '../css/findDoctor.css';

export const FindDoctor = () => {
  const [doctor, setDoctor] = React.useState([]);
  const [totalPages, setTotalPages] = React.useState(0);
  const navigate = useNavigate();
  const [load, setLoad] = React.useState(false);

  const queryParameters = new URLSearchParams(window.location.search);
  const category = queryParameters.get('category');
  const doctorParam = queryParameters.get('doctor');
  const cityParam = queryParameters.get('city');

  const findDoctor = async (searchedDoctor, searchedCity) => {
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
      doctors = await axiosClient.get(
        'api/users?role=doctor&pageSize=9&page=0'
      );
    }
    setDoctor(doctors.data.user);
    setTotalPages(doctors.data.totalPages);
  };

  React.useEffect(() => {
    const getDoctor = async () => {
      setLoad(true);
      let doctors = [];
      if (category) {
        doctors = await axiosClient.get(
          `es/results?category=${category}&pageSize=9&page=0`
        );
      } else if (doctorParam && !cityParam) {
        doctors = await axiosClient.get(`es/results?doctor=${doctorParam}`);
      } else if (cityParam && !doctorParam) {
        doctors = await axiosClient.get(`es/results?city=${cityParam}`);
      } else if (cityParam && doctorParam) {
        doctors = await axiosClient.get(
          `es/results?city=${cityParam}&doctor=${doctorParam}`
        );
      } else {
        doctors = await axiosClient.get(
          'api/users?role=doctor&pageSize=9&page=0'
        );
      }
      setDoctor(doctors.data.user);
      setTotalPages(doctors.data.totalPages);
      setLoad(false);
    };
    getDoctor();
  }, [category, cityParam, doctorParam]);

  if (doctor.length && !load) {
    doctor.map((doc) => (
      <>
        <Grid item xs={6} md={4} key={doc.userId}>
          <Card
            sx={{ maxWidth: 345, height: 400 }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
            }}
            key="doc._id"
            className="card"
          >
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
                {doc.about}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                variant="contained"
                onClick={() => showDoctor(doc.userId)}
                style={{ marginLeft: 'auto', marginRight: 'auto' }}
              >
                Book Now
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </>
    ));
  }

  const showDoctor = (id) => {
    navigate('/findDoctor/' + id);
  };

  const changePage = async (event, pageNo) => {
    let doctors = [];
    if (category) {
      doctors = await axiosClient.get(
        `es/results?category=${category}&pageSize=9&page=${pageNo - 1}`
      );
    } else {
      doctors = await axiosClient.get(
        `api/users?role=doctor&pageSize=9&page=${pageNo - 1}`
      );
    }
    setDoctor(doctors.data.user);
  };

  return (
    <>
      <Card sx={{ display: 'flex' }} className="card-pos">
        <SearchBar
          findDoctor={findDoctor}
          doctorParam={doctorParam}
          cityParam={cityParam}
        />
      </Card>
      {doctor.length && !load ? (
        <Grid container spacing={2} style={{ margin: '10px' }}>
          {doctor.length &&
            !load &&
            doctor.map((doc) => (
              <Grid item xs={6} md={4} key={doc.userId}>
                <Card
                  sx={{ maxWidth: 345, height: 400 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'column',
                  }}
                  key="doc._id"
                  className="card"
                >
                  <CardMedia
                    sx={{ height: 200, objectFit: 'contain' }}
                    image={doc.profileURL}
                    title={doc.firstName}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      style={{ color: '#60a5dd' }}
                    >
                      {doc.firstName} {doc.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {doc.yearsOfExperience} years of experience
                    </Typography>
                    <Typography variant="body2">
                      ₹ {doc.consultationFee} fee
                    </Typography>
                    <div style={{ display: 'flex' }}>
                      <LocationOnIcon />
                      <Typography variant="body2" color="text.secondary">
                        {doc.clinicCity}, {doc.clinicState}, India
                      </Typography>
                    </div>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => showDoctor(doc.userId)}
                      style={{ marginLeft: 'auto', marginRight: 'auto' }}
                    >
                      Book Clinic Visit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      ) : (
        <Typography variant="h4" component="h4" className="no-doctor">
          <span>No Doctor found</span>
        </Typography>
      )}

      {totalPages > 1 ? (
        <Pagination
          color="primary"
          onChange={changePage}
          count={totalPages}
          style={{ margin: '20px' }}
        />
      ) : (
        ''
      )}
    </>
  );
};

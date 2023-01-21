import React from 'react';
import axiosClient from '../api-client';
import { cities } from '../utils/cities.js';
import {
  CardContent,
  Button,
  TextField,
  Autocomplete,
  Grid,
} from '@mui/material';
export const SearchBar = (props) => {
  const [doctor, setDoctor] = React.useState([]);
  const [searchedDoctor, setSearchedDoctor] = React.useState(null);
  const [searchedCity, setSearchedCity] = React.useState(null);

  const flatProps = {
    options: cities,
    getOptionLabel: (option) => option.name,
  };

  const doctorList = {
    options: doctor,
    getOptionLabel: (option) => option.firstName,
  };

  React.useEffect(() => {
    const getDoctor = async () => {
      const doctors = await axiosClient.get('api/users?role=doctor');
      setDoctor(doctors.data);
    };
    if (props.doctorParam) {
      setSearchedDoctor({ firstName: props.doctorParam });
    }
    if (props.cityParam) {
      setSearchedCity({ name: props.cityParam });
    }
    getDoctor();
  }, [props.cityParam, props.doctorParam]);

  const searchDoctor = () => {
    props.findDoctor(searchedDoctor, searchedCity);
  };

  return (
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
            onClick={searchDoctor}
          >
            Find Now
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  );
};

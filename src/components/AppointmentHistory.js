import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api-client';

export const AppointmentHistory = () => {
  const { userData: user } = useSelector((state) => state.authStatus);
  const [appointments, setAppointments] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const getAppointments = async () => {
      const appointment = await axiosClient.get(
        'api/appointmentHistory/' + user.userId
      );
      appointment.data.map((app) => {
        const bookingDate = moment(app.bookingDate);
        const formattedDate = bookingDate.format('D MMM');
        app.bookingDate = formattedDate;
        return app;
      });
      console.log(appointment.data);
      setAppointments(appointment.data);
    };
    getAppointments();
  }, [user]);

  const showDoctor = (id) => {
    console.log(id);
    navigate('/findDoctor/' + id);
  };

  const centerStyle = {
    marginTop: 'auto',
    marginBottom: 'auto',
  };

  return (
    <>
      {appointments.length ? (
        appointments.map((app) => (
          <Card sx={{}} key="app._id" className="card">
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={1} style={centerStyle}>
                  <Typography gutterBottom variant="h5" component="div">
                    {app.bookingDate}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography
                    gutterBottom
                    variant="body2"
                    component="div"
                    style={{ fontWeight: '800' }}
                  >
                    Dr. {app.vetDetail.firstName} {app.vetDetail.lastName},
                    {app.vetDetail.clinicName}
                  </Typography>
                  <Typography gutterBottom variant="body2" component="div">
                    Appointment time: {app.bookedSlot}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Booked for <b>{app.petName}</b> <br />
                    Age: {app.petAge} years
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  ></Typography>
                </Grid>
                <Grid item xs={2} style={centerStyle}>
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => showDoctor(app.vetId)}
                    >
                      Book Again
                    </Button>
                  </CardActions>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="h6" component="h6">
          You don't have any appointments yet!! <br />
          <Button size="small" variant="contained">
            <Link to={'/findDoctor'} className="link white">
              Book Appointment
            </Link>
          </Button>
        </Typography>
      )}
    </>
  );
};

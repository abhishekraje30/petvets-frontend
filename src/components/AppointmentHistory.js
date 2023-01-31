import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  Modal,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api-client';
import notFound from '../assets/images/not-found-1.jpg';

export const AppointmentHistory = () => {
  const { userData: user } = useSelector((state) => state.authStatus);
  const [appointments, setAppointments] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [contact, setContact] = React.useState(false);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const { role } = user;

  React.useEffect(() => {
    setLoading(true);
    const getAppointments = async () => {
      let appointment = [];
      if (role === 'doctor') {
        appointment = await axiosClient.get(
          'api/appointmentHistory/doctor/' + user.userId
        );
      } else {
        appointment = await axiosClient.get(
          'api/appointmentHistory/' + user.userId
        );
      }
      appointment.data.map((app) => {
        const bookingDate = moment(app.bookingDate);
        const formattedDate = bookingDate.format('D MMM');
        app.bookingDate = formattedDate;
        app.isToday = moment().isSameOrAfter(bookingDate);
        return app;
      });
      setLoading(false);
      setAppointments(appointment.data);
    };
    getAppointments();
  }, [role, user]);

  const showDoctor = (id) => {
    console.log(id);
    navigate('/findDoctor/' + id);
  };

  const centerStyle = {
    marginTop: 'auto',
    marginBottom: 'auto',
  };

  const DisabledBackground = styled(Box)({
    width: '100%',
    height: '100%',
    position: 'fixed',
    // background: '#ccc',
    opacity: 0.5,
    zIndex: 1,
  });

  const CircularLoading = () => (
    <>
      <CircularProgress
        size={70}
        sx={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
        }}
      />
      <DisabledBackground />
    </>
  );

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  const cancelAppointment = (app) => {
    setOpen(true);
    setContact(app.vetDetail.mobile);
  };

  return (
    <>
      {loading && (
        <Box>
          <CircularLoading />
        </Box>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            To cancel appointment please contact the clinic <br />
            {contact}
          </Typography>
        </Box>
      </Modal>
      {appointments.length && !loading ? (
        appointments.map((app) => (
          <Card sx={{}} key="app._id" className="card">
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={1} style={centerStyle}>
                  <Typography gutterBottom variant="h5" component="div">
                    {app.bookingDate}
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography
                    gutterBottom
                    variant="body2"
                    component="div"
                    style={{ fontWeight: '800' }}
                  >
                    {role === 'doctor' ? (
                      <p>
                        {app.userDetail.firstName} {app.userDetail.lastName}
                      </p>
                    ) : (
                      <p>
                        Dr. {app.vetDetail.firstName} {app.vetDetail.lastName},
                        {app.vetDetail.clinicName}
                      </p>
                    )}
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
                {role !== 'doctor' && (
                  <Grid item xs={4} style={centerStyle}>
                    <CardActions>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => showDoctor(app.vetId)}
                      >
                        Book Again
                      </Button>
                      {!app.isToday && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => cancelAppointment(app)}
                        >
                          Cancel
                        </Button>
                      )}
                    </CardActions>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        ))
      ) : (
        <>
          <Grid container spacing={1}>
            <Grid item xs={6} style={centerStyle}>
              <img
                src={notFound}
                alt="not-found"
                style={{
                  height: '500px',
                  marginRight: 'auto',
                  marginTop: '20px',
                  width: '570px',
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="h6"
                component="h6"
                style={{ position: 'relative', top: '50%' }}
              >
                Ahh! No Appointments.. <br />
                {role === 'doctor' ? null : (
                  <Button size="small" variant="contained">
                    <Link to={'/findDoctor'} className="link white">
                      Book Now
                    </Link>
                  </Button>
                )}
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

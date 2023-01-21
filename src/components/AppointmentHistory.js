import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Modal,
} from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api-client';
import { styled } from '@mui/system';

export const AppointmentHistory = () => {
  const { userData: user } = useSelector((state) => state.authStatus);
  const [appointments, setAppointments] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [contact, setContact] = React.useState(false);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    setLoading(true);
    const getAppointments = () => {
      axiosClient
        .get('api/appointmentHistory/' + user.userId)
        .then((appointment) => {
          appointment.data.map((app) => {
            const bookingDate = moment(app.bookingDate);
            const formattedDate = bookingDate.format('D MMM');
            app.bookingDate = formattedDate;
            app.isToday = moment().isSameOrAfter(bookingDate);
            return app;
          });
          setLoading(false);
          setAppointments(appointment.data);
        });
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
      {appointments.length &&
        !loading &&
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
              </Grid>
            </CardContent>
          </Card>
        ))}
      {!appointments.length && !loading && (
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

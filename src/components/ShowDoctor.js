import moment from 'moment';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api-client';
import '../css/showDoctor.css';

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Stack,
  TextField,
  Snackbar,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useSelector } from 'react-redux';
import Payment from './PaymentModal';

export const ShowDoctor = () => {
  const params = useParams();
  const [bookNow, setBookNow] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(moment().format('LL'));
  const [availableSlot, setAvailableSlot] = React.useState([]);
  const [bookedSlots, setBookedSlots] = React.useState([]);
  const [selectedSlot, setSelectedSlot] = React.useState();
  const [active, setActive] = React.useState(false);
  const [doctor, setDoctor] = React.useState([]);
  const { userData: user } = useSelector((state) => state.authStatus);
  const [snackMessage, setSnackMessage] = React.useState('');
  const [openSnack, setOpenSnack] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const navigate = useNavigate();

  const steps = ['Select Date & Time', 'Add Details', 'Booking Confirmation'];
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    name: {
      value: '',
      error: false,
      errorMessage: 'Please enter a name',
    },
    petAge: {
      value: '',
      error: false,
      errorMessage: 'Please enter your pet age',
    },
    petName: {
      value: '',
      error: false,
      errorMessage: `Please enter your pet name`,
    },
    contact: {
      value: '',
      error: false,
      errorMessage: 'Please enter your contact no.',
    },
  });

  React.useEffect(() => {
    const getDoctor = async () => {
      const doctors = await axiosClient.get('api/users/' + params.id);
      setDoctor(doctors.data);
    };
    getDoctor();
  }, [params.id]);

  const showCalendar = () => {
    setBookNow(true);
  };

  const getBookedAppointments = (formattedDate) =>
    axiosClient
      .get(`api/appointments?vetId=${params.id}&date=${formattedDate}`)
      .then((res) => res.data)
      .catch((err) => err);

  const disableWeekends = (date) => {
    const day = date.$d.getDay();
    if (doctor.clinicDaysOff.length) {
      return doctor.clinicDaysOff.includes(day);
    }
    return [];
  };

  const showSlots = async (date) => {
    const formattedDate = moment(date.$d).format('YYYY-MM-DD');
    const startTime = moment(doctor.startTime, 'HH:mm');
    const endTime = moment(doctor.endTime, 'HH:mm');
    const slots = [];

    setSelectedDate(moment(date.$d).format('LL'));
    setAvailableSlot([]);
    setBookedSlots([]);

    while (startTime < endTime) {
      slots.push(startTime.format('HH:mm'));
      startTime.add('30', 'minutes');
    }

    await getBookedAppointments(formattedDate).then((res) => {
      setBookedSlots(res);
    });
  };

  const setSlots = React.useCallback(() => {
    const startTime = moment(doctor.startTime, 'HH:mm');
    const endTime = moment(doctor.endTime, 'HH:mm');
    const slots = [];
    const notAvailableSlot = bookedSlots.map((bs) => bs.bookedSlot);

    while (startTime < endTime) {
      slots.push(startTime.format('HH:mm'));
      startTime.add('30', 'minutes');
    }

    const availableSlots = slots.filter((el) => !notAvailableSlot.includes(el));
    setAvailableSlot(availableSlots);
  }, [bookedSlots, doctor.endTime, doctor.startTime]);

  React.useEffect(() => {
    setSlots();
  }, [bookedSlots, setSlots]);

  const selectSlot = (e) => {
    setActive(true);
    setSelectedSlot(e.target.textContent);
  };

  const slotButton = (slot) => (
    <>
      <Button
        variant="outlined"
        key={slot}
        className="btn"
        style={{
          backgroundColor:
            active && selectedSlot === slot ? '#1976d2' : 'white',
          color: active && selectedSlot === slot ? 'white' : '',
        }}
        // disabled={slot.disabled}
        onClick={(e) => selectSlot(e)}
      >
        {slot}
      </Button>
    </>
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: {
        ...formData[name],
        value,
      },
    });
    validateInput(e);
  };

  const validateInput = (e) => {
    let { name, value } = e.target;
    setFormData((prev) => {
      const stateObj = { ...prev };

      if (!value) {
        stateObj[name].error = true;
      } else {
        stateObj[name].error = false;
      }
      if (name === 'petAge' && value > 15) {
        stateObj[name].error = true;
        stateObj[name].errorMessage = 'Please enter a valid age';
      } else if (name === 'contact') {
        let expr = /^(0|91)?[6-9][0-9]{9}$/;
        if (!expr.test(value)) {
          stateObj[name].error = true;
          stateObj[name].errorMessage = 'Invalid Mobile Number.';
        }
      }
      return stateObj;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formFields = Object.keys(formData);
    let newFormValues = { ...formData };
    for (let index = 0; index < formFields.length; index++) {
      const currentField = formFields[index];
      if (formData[currentField].error) {
        return;
      }
    }

    setFormData(newFormValues);
    setActiveStep(2);
  };

  const closeSnackbar = (event, reason) => {
    if ('clickaway' === reason) return;
    setOpenSnack(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={closeSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const capturePaymentDetails = async (values) => {
    values.contactNo = formData.contact.value;
    values.petName = formData.petName.value;
    values.userName = formData.name.value;
    values.petAge = formData.petAge.value;
    values.bookedSlot = selectedSlot;
    values.bookingDate = moment.utc(moment(selectedDate)).format();
    values.vetDetail = doctor;
    values.userDetail = user;
    try {
      await axiosClient.post('api/payment/', values);
      setOpenSnack(true);
      setSnackMessage('Payment Successful');
      setOpenModal(false);
      navigate('/myAppointments');
    } catch (e) {
      setOpenSnack(true);
      setSnackMessage(e.response.data.msg.raw.message);
      setOpenModal(true);
    }
  };

  return (
    <div className="card">
      <Card>
        <Box sx={{ flexGrow: 1 }} style={{ marginTop: '15px' }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <CardMedia
                sx={{ height: 140 }}
                image={doctor.profileURL}
                title={doctor.firstName}
                alt="vet image"
              />
            </Grid>
            <Grid item xs={8}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {doctor.firstName} {doctor.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {doctor.yearsOfExperience} years of experience
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {doctor.about}
                </Typography>
                <Typography variant="body2" color="#1976d2">
                  ₹ {doctor.consultationFee} fee
                </Typography>
              </CardContent>
              {!bookNow && (
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={showCalendar}
                  >
                    Book Now
                  </Button>
                </CardActions>
              )}
            </Grid>
          </Grid>
        </Box>
      </Card>
      {bookNow ? (
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep} className="center-content">
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === 0 && (
            <React.Fragment>
              <div className="center-content" style={{ height: '45vh' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack spacing={3}>
                    <DatePicker
                      views={['day']}
                      minDate={new Date()}
                      label="Select a date"
                      value={selectedDate}
                      onChange={(newDate) => showSlots(newDate)}
                      renderInput={(params) => (
                        <TextField {...params} helperText={null} />
                      )}
                      shouldDisableDate={disableWeekends}
                    />
                  </Stack>
                </LocalizationProvider>
                {availableSlot.length > 0 && (
                  <>
                    <p>Available Slots:</p>
                    {availableSlot.map((slots) => slotButton(slots))}
                  </>
                )}
              </div>
            </React.Fragment>
          )}
          {activeStep === 1 && (
            <React.Fragment>
              <Box
                className="center-content"
                sx={{
                  width: '50% !important',
                  alignItems: 'center',
                  '& > :not(style)': { m: 1 },
                }}
                component="form"
                onSubmit={handleSubmit}
              >
                <TextField
                  className="label"
                  fullWidth
                  label="Name"
                  name="name"
                  required
                  onChange={handleChange}
                  onBlur={validateInput}
                  value={formData.name.value}
                />
                {formData.name.error && (
                  <small style={{ color: 'red' }}>
                    {formData.name.errorMessage}
                  </small>
                )}
                <br />
                <TextField
                  className="label"
                  fullWidth
                  id="pet-name"
                  name="petName"
                  label="Pet's Name"
                  required
                  onChange={handleChange}
                  onBlur={validateInput}
                  value={formData.petName.value}
                />
                {formData.petName.error && (
                  <small style={{ color: 'red' }}>
                    {formData.petName.errorMessage}
                  </small>
                )}
                <br />
                <TextField
                  className="label"
                  fullWidth
                  id="pet-age"
                  name="petAge"
                  label="Pet's Age"
                  required
                  type="number"
                  onChange={handleChange}
                  onBlur={validateInput}
                  value={formData.petAge.value}
                />
                {formData.petAge.error && (
                  <small style={{ color: 'red' }}>
                    {formData.petAge.errorMessage}
                  </small>
                )}
                <br />
                <TextField
                  className="label"
                  fullWidth
                  id="contact"
                  name="contact"
                  label="Contact"
                  required
                  onChange={handleChange}
                  onBlur={validateInput}
                  value={formData.contact.value}
                />
                {formData.contact.error && (
                  <small style={{ color: 'red' }}>
                    {formData.contact.errorMessage}
                  </small>
                )}
              </Box>
            </React.Fragment>
          )}
          {activeStep === 2 && (
            <React.Fragment>
              <Box
                className="center-content"
                sx={{
                  alignItems: 'center',
                  '& > :not(style)': { m: 1 },
                }}
              >
                <Card sx={{ maxWidth: 800 }}>
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      Appointment Booked for {selectedDate} at {selectedSlot}
                    </Typography>
                    <Typography variant="body2" color="#1976d2">
                      ₹ {doctor.consultationFee} fee
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </React.Fragment>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'row', ml: 20, mr: 20 }}>
            {activeStep !== 0 && (
              <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            <Box sx={{ flex: '1 1 auto' }} />

            {activeStep < 2 && (
              <Button
                onClick={activeStep === 0 ? handleNext : handleSubmit}
                disabled={
                  (activeStep === 0 && !selectedSlot) ||
                  (activeStep === 1 &&
                    (!formData.name.value ||
                      !formData.petName.value ||
                      !formData.petAge.value ||
                      !formData.contact.value))
                }
              >
                Next
              </Button>
            )}
            {activeStep === 2 && (
              <>
                <Payment
                  capturePaymentDetails={capturePaymentDetails}
                  openModal={openModal}
                />
                <Snackbar
                  open={openSnack}
                  autoHideDuration={6000}
                  onClose={closeSnackbar}
                  message={snackMessage}
                  action={action}
                />
              </>
            )}
          </Box>
        </Box>
      ) : (
        <Card className="card">
          <CardContent>
            <Typography variant="h6" component="h2">
              Services
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {doctor.services}
            </Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

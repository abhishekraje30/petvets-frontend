import {
  Alert,
  Autocomplete,
  Button,
  Grid,
  Snackbar,
  TextareaAutosize,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { updateUserProfileAPI } from '../../actions/users.actions';
import { prevStepper } from '../../reducers/navigation.reducer';
import { states, weeks } from '../../utilities/constants';

const profileValidation = Yup.object({
  clinicName: Yup.string().required('Please enter your clinic name'),
  about: Yup.string().required('Please enter your about yourself'),
  clinicAddress1: Yup.string().required(
    'Please enter your clinic street/colony name'
  ),
  clinicAddress2: Yup.string().required('Please enter your clinic area name'),
  clinicCity: Yup.string().required('Please enter your clinic area name'),
  clinicState: Yup.string().required('Please enter your clinic state'),
  clinicDaysOff: Yup.array().required('Please enter your clinic state'),
  clinicContactNo: Yup.number()
    .min(1000000000, 'Please enter a valid phone number')
    .max(9999999999, 'Please enter a valid phone number')
    .integer('Please enter a valid phone number')
    .typeError('Please enter a valid phone number')
    .required('Please enter a valid phone number'),
  clinicPincode: Yup.number()
    .min(100000, 'Please enter a valid pincode')
    .max(999999, 'Please enter a valid pincode')
    .integer('Please enter a valid pincode')
    .typeError('Please enter a valid pincode')
    .required('Please enter a valid pincode'),
});

const ClinicDetails = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { userId, userData } = useSelector((state) => state.authStatus);
  const { role } = userData;

  const getClinicDaysOff = () => {
    const { clinicDaysOff } = userData;
    const daysOff = clinicDaysOff.map((day) => weeks[day]);
    return daysOff;
  };

  const initialValues = {
    about: userData?.about || '',
    clinicName: userData?.clinicName || '',
    clinicAddress1: userData?.clinicAddress1 || '',
    clinicAddress2: userData?.clinicAddress2 || '',
    clinicCity: userData?.clinicCity || '',
    clinicState: userData?.clinicState || '',
    clinicPincode: userData?.clinicPincode || '',
    clinicContactNo: userData?.clinicContactNo || '',
    clinicDaysOff: getClinicDaysOff(),
    consultationFee: userData?.consultationFee || '',
  };

  const userUpdate = useMutation(updateUserProfileAPI, {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const formik = useFormik({
    initialValues: { ...initialValues },
    validationSchema: profileValidation,
    onSubmit: (values) => {
      const clinicDaysOff = values.clinicDaysOff.map((day) => day.value);
      const userDetails = {
        ...values,
        clinicDaysOff,
      };
      userUpdate.mutate({
        userId,
        ...userDetails,
      });

      setSnackbarMessage('User updated successfully');
      setOpen(true);
    },
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  return (
    <>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <form onSubmit={formik.handleSubmit} method="post">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              required
              fullWidth
              id="clinicName"
              name="clinicName"
              label="Clinic Name"
              disabled={role === 'admin'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.clinicName}
              error={
                formik.touched.clinicName && Boolean(formik.errors.clinicName)
              }
              helperText={formik.touched.clinicName && formik.errors.clinicName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              required
              fullWidth
              id="clinicAddress1"
              disabled={role === 'admin'}
              name="clinicAddress1"
              label="Street/Colony Name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.clinicAddress1}
              error={
                formik.touched.clinicAddress1 &&
                Boolean(formik.errors.clinicAddress1)
              }
              helperText={
                formik.touched.clinicAddress1 && formik.errors.clinicAddress1
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              required
              fullWidth
              id="clinicAddress2"
              disabled={role === 'admin'}
              name="clinicAddress2"
              label="Area Name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.clinicAddress2}
              error={
                formik.touched.clinicAddress2 &&
                Boolean(formik.errors.clinicAddress2)
              }
              helperText={
                formik.touched.clinicAddress2 && formik.errors.clinicAddress2
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              required
              fullWidth
              id="clinicCity"
              name="clinicCity"
              label="City"
              disabled={role === 'admin'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.clinicCity}
              error={
                formik.touched.clinicCity && Boolean(formik.errors.clinicCity)
              }
              helperText={formik.touched.clinicCity && formik.errors.clinicCity}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={states}
              disabled={role === 'admin'}
              isOptionEqualToValue={(option, value) => option.label === value}
              value={formik.values.clinicState}
              onChange={(_, value) =>
                formik.setFieldValue('clinicState', value?.label)
              }
              renderInput={(params) => (
                <TextField
                  onBlur={formik.handleBlur}
                  fullWidth
                  error={
                    formik.touched.clinicState &&
                    Boolean(formik.errors.clinicState)
                  }
                  helperText={
                    formik.touched.clinicState && formik.errors.clinicState
                  }
                  {...params}
                  label="State"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              required
              fullWidth
              id="clinicPincode"
              name="clinicPincode"
              label="Pincode"
              disabled={role === 'admin'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.clinicPincode}
              error={
                formik.touched.clinicPincode &&
                Boolean(formik.errors.clinicPincode)
              }
              helperText={
                formik.touched.clinicPincode && formik.errors.clinicPincode
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={weeks}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              multiple={true}
              disabled={role === 'admin'}
              value={formik.values.clinicDaysOff}
              onChange={(_, value) =>
                formik.setFieldValue('clinicDaysOff', value)
              }
              getOptionLabel={(options) => options.label}
              renderInput={(params) => (
                <TextField
                  onBlur={formik.handleBlur}
                  fullWidth
                  error={
                    formik.touched.clinicDaysOff &&
                    Boolean(formik.errors.clinicDaysOff)
                  }
                  helperText={
                    formik.touched.clinicDaysOff && formik.errors.clinicDaysOff
                  }
                  {...params}
                  label="Days Off"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextareaAutosize
              autoComplete="given-name"
              required
              style={{ width: '100%' }}
              id="about"
              name="about"
              label="About"
              minRows={5}
              placeholder="Please add some information about yourself"
              disabled={role === 'admin'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.about}
              error={formik.touched.about && Boolean(formik.errors.about)}
            />
            <small style={{ color: 'red' }}>
              {formik.touched.about && formik.errors.about}*
            </small>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            pt: 2,
          }}
        >
          <Grid>
            <Button color="inherit" onClick={() => dispatch(prevStepper())}>
              Back
            </Button>
          </Grid>
          <Grid>
            {role !== 'admin' ? (
              <Button
                type="submit"
                variant="contained"
                disabled={!formik.isValid}
              >
                Save
              </Button>
            ) : null}
          </Grid>
        </Box>
      </form>
    </>
  );
};

export default ClinicDetails;

import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { useFormik } from 'formik';
import React from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { updateUserProfileAPI } from '../../actions/users.actions';
import { prevStepper } from '../../reducers/navigation.reducer';
import { states, weeks } from '../../utilities/constants';

const profileValidation = Yup.object({
  clinicName: Yup.string().required('Please enter your clinic name'),
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
  const { userId, userData } = useSelector((state) => state.authStatus);

  const initialValues = {
    clinicName: userData?.clinicName || '',
    clinicAddress1: userData?.clinicAddress1 || '',
    clinicAddress2: userData?.clinicAddress2 || '',
    clinicCity: userData?.clinicCity || '',
    clinicState: userData?.clinicState || '',
    clinicPincode: userData?.clinicPincode || '',
    clinicContactNo: userData?.clinicContactNo || '',
    clinicDaysOff: userData?.clinicDaysOff || '',
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
      userUpdate.mutate({
        userId,
        ...values,
      });
    },
  });
  return (
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
            multiple={true}
            value={formik.values.clinicDaysOff}
            onChange={(_, value) =>
              formik.setFieldValue('clinicDaysOff', value)
            }
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
          {/* {console.log(formik)} */}
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
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Grid>
      </Box>
    </form>
  );
};

export default ClinicDetails;

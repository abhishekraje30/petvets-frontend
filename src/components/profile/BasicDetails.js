import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar/Snackbar';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/de';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { updateUserProfileAPI } from '../../actions/users.actions';
import styles from '../../css/user-profile.module.css';
import { nextStepper } from '../../reducers/navigation.reducer';

const profileValidation = Yup.object({
  firstName: Yup.string().required('Please enter your First Name'),
  lastName: Yup.string().required('Please enter your Last Name'),
  gender: Yup.string().required('Please select your gender*'),
  dob: Yup.number().required('Please select your date of birth'),
  mobile: Yup.number()
    .min(1000000000, 'Please enter a valid phone number')
    .max(9999999999, 'Please enter a valid phone number')
    .integer('Please enter a valid phone number')
    .typeError('Please enter a valid phone number')
    .required('Required'),
});

const BasicDetails = ({ userId, userData }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState({ preview: '', raw: '' });
  const { userData: loginUserData } = useSelector((state) => state.authStatus);
  const storage = getStorage();
  const { role } = loginUserData;
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const profilePath = userData.profileURL;
        const storageRef = ref(storage, profilePath);
        const url = await getDownloadURL(storageRef);
        setImage({ ...image, preview: url });
      } catch (error) {
        if (error.code === 'storage/invalid-url') {
          const profilePath = userData.profileURL;
          setImage({ ...image, preview: profilePath });
        } else {
          setImage({ ...image, preview: '/Avatar.jpg' });
        }
      }
    };
    fetchProfilePic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storage, userId, userData]);

  const initialValues = {
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    dob: userData?.dob,
    gender: userData?.gender,
    mobile: userData?.mobile,
  };

  const handleFileChange = (e) => {
    if (e.target.files.length) {
      const rawImg = e.target.files[0];
      setImage({
        preview: URL.createObjectURL(rawImg),
        raw: rawImg,
      });
    }
  };

  const userUpdate = useMutation(updateUserProfileAPI, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const formik = useFormik({
    initialValues: { ...initialValues },
    validationSchema: profileValidation,
    onSubmit: (values) => {
      console.log(userId);
      userUpdate.mutate({
        userId,
        ...values,
      });
      const formData = new FormData();
      const rawImg = image.raw;
      const imgType = rawImg.name.split('.').at(-1);
      formData.append('image', rawImg);
      const imgPath = `${userId}/profile.${imgType}`;
      const storageRef = ref(storage, imgPath);
      uploadBytes(storageRef, rawImg).then((snapshot) => {
        userUpdate.mutate({
          userId,
          profileURL: imgPath,
        });
        console.log('Uploaded a blob or file!');
      });
      setSnackbarMessage('User updated successfully');
      setOpen(true);
      console.log(values);
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
        <Grid
          item
          xs={12}
          sm={5}
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            marginBottom: '1rem',
          }}
        >
          <label htmlFor="upload-button">
            <img
              src={image.preview}
              alt="profilePic"
              width={150}
              height={150}
              style={{ borderRadius: '50%' }}
            />
          </label>
          {role === 'admin' ? null : (
            <input
              type="file"
              id="upload-button"
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleFileChange}
            />
          )}

          <br />
          {role === 'admin' ? null : (
            <Button variant="outlined" component="label">
              Upload Profile Pic
              <input
                type="file"
                id="upload-button"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
          )}
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              required
              fullWidth
              id="firstName"
              name="firstName"
              label="First Name"
              disabled={role === 'admin'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={formik.touched.firstName && formik.errors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              required
              fullWidth
              id="lastName"
              name="lastName"
              label="Last Name"
              disabled={role === 'admin'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
              <DatePicker
                label="Date of Birth"
                value={formik.values.dob}
                onChange={(value) =>
                  formik.setFieldValue('dob', Date.parse(value))
                }
                name="dob"
                disabled={role === 'admin'}
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    onBlur={formik.handleBlur}
                    disabled={role === 'admin'}
                    error={formik.touched.dob && Boolean(formik.errors.dob)}
                    {...params}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              fullWidth
              variant="outlined"
              required
              id="mobile"
              name="mobile"
              label="Mobile Number"
              onChange={formik.handleChange}
              disabled={role === 'admin'}
              onBlur={formik.handleBlur}
              error={formik.touched.mobile && Boolean(formik.errors.mobile)}
              value={formik.values.mobile}
              helperText={formik.touched.mobile && formik.errors.mobile}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+91</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Gender
            </FormLabel>
            <RadioGroup
              row
              aria-required
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="gender"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.gender}
            >
              <FormControlLabel
                value="Female"
                disabled={role === 'admin'}
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel
                disabled={role === 'admin'}
                value="Male"
                control={<Radio />}
                label="Male"
              />
            </RadioGroup>
            {formik.errors.gender ? (
              <small className={styles.errorText}>{formik.errors.gender}</small>
            ) : null}
          </Grid>
        </Grid>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            pt: 2,
          }}
        >
          {role !== 'user' ? (
            <Button onClick={() => dispatch(nextStepper())}>Next</Button>
          ) : null}

          {role !== 'admin' ? (
            <Button
              type="submit"
              variant="contained"
              disabled={!formik.isValid}
            >
              Save
            </Button>
          ) : null}
        </Box>
      </form>
    </>
  );
};
export default BasicDetails;

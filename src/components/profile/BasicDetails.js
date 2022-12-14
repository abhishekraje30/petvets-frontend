import {
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
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/de';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { useFormik } from 'formik';
import React, { useState } from 'react';
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

const BasicDetails = () => {
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState('');
  const [image, setImage] = useState({ preview: '', raw: '' });
  const { userId, userData } = useSelector((state) => state.authStatus);

  const initialValues = {
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    dob: userData?.dob,
    gender: userData?.gender,
    mobile: userData?.mobile,
  };

  const handleFileChange = (e) => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  const storage = getStorage();
  const storageRef = ref(storage, `${userId}/${image.raw.name}`);

  const handleFileUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image.raw);
    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, image.raw).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });
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
      console.log(userId);
      userUpdate.mutate({
        userId,
        ...values,
      });
      console.log(values);
    },
  });
  return (
    <>
      <div>
        <label htmlFor="upload-button">
          {image.preview ? (
            <img src={image.preview} alt="dummy" width="300" height="300" />
          ) : (
            <>
              <img
                src="https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"
                alt="Avatar"
              />
              <h5 className="text-center">Upload your photo</h5>
            </>
          )}
        </label>
        <input
          type="file"
          id="upload-button"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <br />
        <Button variant="contained" onClick={handleFileUpload}>
          {' '}
          Update Image
        </Button>
      </div>
      <br />
      <br />
      <form onSubmit={formik.handleSubmit} method="post">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              required
              fullWidth
              id="firstName"
              name="firstName"
              label="First Name"
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
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    onBlur={formik.handleBlur}
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
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
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
          <Button onClick={() => dispatch(nextStepper())}>Next</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Box>
      </form>
    </>
  );
};
export default BasicDetails;

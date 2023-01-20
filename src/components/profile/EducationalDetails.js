import { ExpandMoreOutlined } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import 'dayjs/locale/de';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { updateUserProfileAPI } from '../../actions/users.actions';
import { nextStepper, prevStepper } from '../../reducers/navigation.reducer';
import { degrees } from '../../utilities/constants';

const initialValues = {
  collegeName: 'JNEC Aurangabad',
  specialization: 'Animal Nutrition',
  passingMarks: '8.9',
  passingYear: '2017',
  degree: 'Bachelor of Veterinary Science [BVSc]',
};

const educationValidation = Yup.object({
  collegeName: Yup.string().required('Please enter your college name'),
  passingMarks: Yup.number().required('Please enter your grade'),
  degree: Yup.string().required('Please select your degree'),
  passingYear: Yup.number()
    .min(1950, 'Please enter a valid passing year')
    .max(new Date().getFullYear(), 'Please enter a valid passing year')
    .integer('Please enter a valid passing year')
    .typeError('Please enter a valid passing year')
    .required('Please enter a valid passing year'),
  specialization: Yup.string().required(
    'Please enter your course specialization'
  ),
});

const EducationalDetails = () => {
  const [open, setOpen] = useState(false);
  const [education, setEducation] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const { userId, userData } = useSelector((state) => state.authStatus);

  const initialValues = {
    collegeName: '',
    specialization: '',
    passingMarks: '',
    passingYear: '',
    degree: '',
  };

  const userUpdate = useMutation(updateUserProfileAPI, {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  useEffect(() => {
    if (userData.degree === undefined) {
      userUpdate.mutate({
        userId,
        degree: [],
      });
    } else {
      setEducation([userData?.degree]);
    }
  }, [userData.degree, userId, userUpdate]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const formik = useFormik({
    initialValues: { ...initialValues },
    validationSchema: educationValidation,
    onSubmit: (values) => {
      // setEducation([...education, values]);
      setOpen(false);
    },
  });

  const dispatch = useDispatch();

  const handleSave = () => {
    console.log(education);
    userUpdate.mutate({
      userId,
      degree: education,
    });
  };

  return (
    <>
      <Grid item xs={12} sm={6}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Education
        </Button>
        {education.length
          ? education.map((edu, index) => (
              <Accordion
                key={index}
                expanded={expanded === 'panel1'}
                onChange={handleChange('panel1')}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreOutlined />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography>{edu.degree}</Typography>
                    <Typography>{edu.collegeName}</Typography>
                    <Typography>{edu.passingMarks}%</Typography>
                    <Typography>{edu.passingYear}</Typography>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Nulla facilisi. Phasellus sollicitudin nulla et quam mattis
                    feugiat. Aliquam eget maximus est, id dignissim quam.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))
          : null}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="md"
          scroll="paper"
        >
          <DialogTitle>Add Degree/Certification</DialogTitle>
          <Box
            onSubmit={formik.handleSubmit}
            component="form"
            noValidate
            sx={{ mt: 5 }}
          >
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    autoComplete="given-name"
                    required
                    fullWidth
                    id="collegeName"
                    name="collegeName"
                    label="College Name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.collegeName}
                    error={
                      formik.touched.collegeName &&
                      Boolean(formik.errors.collegeName)
                    }
                    helperText={
                      formik.touched.collegeName && formik.errors.collegeName
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  spacing={2}
                  container
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Grid item xs={12} sm={7}>
                    <Autocomplete
                      disablePortal
                      fullWidth
                      id="combo-box-demo"
                      options={degrees}
                      value={degrees[1]}
                      onChange={(_, value) =>
                        formik.setFieldValue('degree', value?.value)
                      }
                      renderInput={(params) => (
                        <TextField
                          onBlur={formik.handleBlur}
                          fullWidth
                          error={
                            formik.touched.degree &&
                            Boolean(formik.errors.degree)
                          }
                          helperText={
                            formik.touched.degree && formik.errors.degree
                          }
                          {...params}
                          label="Degree"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      autoComplete="given-name"
                      required
                      fullWidth
                      id="specialization"
                      name="specialization"
                      label="Specialization"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.specialization}
                      error={
                        formik.touched.specialization &&
                        Boolean(formik.errors.specialization)
                      }
                      helperText={
                        formik.touched.specialization &&
                        formik.errors.specialization
                      }
                    />
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Grid>
                    <TextField
                      autoComplete="given-name"
                      required
                      fullWidth
                      id="passingMarks"
                      name="passingMarks"
                      label="Grades"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.passingMarks}
                      error={
                        formik.touched.passingMarks &&
                        Boolean(formik.errors.passingMarks)
                      }
                      helperText={
                        formik.touched.passingMarks &&
                        formik.errors.passingMarks
                      }
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      autoComplete="given-name"
                      required
                      fullWidth
                      id="passingYear"
                      name="passingYear"
                      label="Passing Year"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.passingYear}
                      error={
                        formik.touched.passingYear &&
                        Boolean(formik.errors.passingYear)
                      }
                      helperText={
                        formik.touched.passingYear && formik.errors.passingYear
                      }
                    />
                  </Grid>
                  <Button variant="outlined" component="label">
                    Upload Degree Certificate
                    <input type="file" hidden />
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Add
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
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
          <Button onClick={() => dispatch(nextStepper())}>Next</Button>
          <Button
            onClick={handleSave}
            disabled={education.length === 0}
            variant="contained"
          >
            Save
          </Button>
        </Grid>
      </Box>
    </>
  );
};

export default EducationalDetails;

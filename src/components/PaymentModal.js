import { forwardRef, useRef, useState, useImperativeHandle } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { LoadingButton } from '@mui/lab';
import { Grid, TextField } from '@mui/material';
// form builder
import { useFormik, Form, FormikProvider } from 'formik';
// validation
import * as Yup from 'yup';

const Payment = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useImperativeHandle(ref, () => ({
    openModal() {
      handleClickOpen();
    },
  }));

  const PaymentSchema = Yup.object().shape({
    cardHolderName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Holders name is required'),
    cardNumber: Yup.number().required('Card number is required'),
    cardMonth: Yup.number().required('Month is required'),
    cardYear: Yup.number().required('Year is required'),
    cardCvv: Yup.number().required('CVV is required'),
  });

  const formik = useFormik({
    initialValues: {
      cardHolderName: 'John Doe',
      cardNumber: '5555555555554444',
      cardMonth: '12',
      cardYear: '2034',
      cardCvv: '123',
    },
    validationSchema: PaymentSchema,
    onSubmit: (values, { setSubmitting }) => {
      props.capturePaymentDetails(values);
      setOpen(props.openModal);
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Proceed to Payment
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>You're almost there!</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter your card details to book appointment.
              </DialogContentText>

              <Grid sx={{ my: 2 }} container spacing={3}>
                <Grid item xs={12} md={8} lg={8}>
                  <TextField
                    margin="dense"
                    name="cardNumber"
                    label="CARD NUMBER"
                    type="number"
                    fullWidth
                    {...getFieldProps('cardNumber')}
                    error={Boolean(touched.cardNumber && errors.cardNumber)}
                    helperText={touched.cardNumber && errors.cardNumber}
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <TextField
                    margin="dense"
                    name="cardCvv"
                    label="CVV"
                    type="number"
                    fullWidth
                    {...getFieldProps('cardCvv')}
                    error={Boolean(touched.cardCvv && errors.cardCvv)}
                    helperText={touched.cardCvv && errors.cardCvv}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={12}>
                  <TextField
                    margin="dense"
                    name="cardHolderName"
                    label="CARDHOLDER NAME"
                    type="text"
                    fullWidth
                    {...getFieldProps('cardHolderName')}
                    error={Boolean(
                      touched.cardHolderName && errors.cardHolderName
                    )}
                    helperText={touched.cardHolderName && errors.cardHolderName}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    margin="dense"
                    name="month"
                    label="MONTH"
                    type="number"
                    fullWidth
                    {...getFieldProps('cardMonth')}
                    error={Boolean(touched.cardMonth && errors.cardMonth)}
                    helperText={touched.cardMonth && errors.cardMonth}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    margin="dense"
                    name="cardYear"
                    label="YEAR"
                    type="number"
                    fullWidth
                    {...getFieldProps('cardYear')}
                    error={Boolean(touched.cardYear && errors.cardYear)}
                    helperText={touched.cardYear && errors.cardYear}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <LoadingButton onClick={handleClose}>Cancel</LoadingButton>
              <LoadingButton variant="contained" type="submit">
                Confirm Payment
              </LoadingButton>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </div>
  );
});

export default Payment;
